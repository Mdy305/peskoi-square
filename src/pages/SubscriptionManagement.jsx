import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function SubscriptionManagement() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['userClients'],
    queryFn: () => base44.entities.SaasClient.filter({ created_by: user?.email }),
    enabled: !!user
  });

  const checkoutMutation = useMutation({
    mutationFn: ({ client_id, tier }) => base44.functions.invoke('stripeCreateCheckout', { client_id, tier }),
    onSuccess: (res) => {
      window.location.href = res.data.checkout_url;
    }
  });

  const portalMutation = useMutation({
    mutationFn: (client_id) => base44.functions.invoke('stripeCustomerPortal', { client_id }),
    onSuccess: (res) => {
      window.location.href = res.data.portal_url;
    }
  });

  const client = clients[0];

  const tiers = [
    {
      name: 'Starter',
      id: 'starter',
      price: 99,
      features: ['AI Chat Widget', 'Square Integration', 'Booking Management', 'Email Support']
    },
    {
      name: 'Professional',
      id: 'professional',
      price: 199,
      features: ['Everything in Starter', 'Client Automation', 'Advanced Analytics', 'Priority Support', 'Custom Branding']
    },
    {
      name: 'Enterprise',
      id: 'enterprise',
      price: 499,
      features: ['Everything in Professional', 'White-label Agency', 'Unlimited Clients', 'Dedicated Account Manager', 'Custom Integrations']
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">
          Subscription
        </p>

        {client && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b border-white/[0.08] pb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-2">Current Plan</p>
                <p className="text-2xl font-light tracking-wide capitalize">{client.subscription_tier}</p>
                <p className="text-xs text-white/40 mt-2">
                  Status: <span className="capitalize">{client.subscription_status}</span>
                </p>
                {client.subscription_current_period_end && (
                  <p className="text-xs text-white/40 mt-1">
                    Renews: {new Date(client.subscription_current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {client.stripe_customer_id && (
                <button
                  onClick={() => portalMutation.mutate(client.id)}
                  disabled={portalMutation.isPending}
                  className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-50"
                >
                  {portalMutation.isPending ? 'Loading...' : 'Manage Billing'}
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-white/[0.08] p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg tracking-wide mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light">${tier.price}</span>
                  <span className="text-xs text-white/40">/month</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-white/60">{feature}</span>
                  </div>
                ))}
              </div>

              {client && (
                <button
                  onClick={() => checkoutMutation.mutate({ client_id: client.id, tier: tier.id })}
                  disabled={
                    checkoutMutation.isPending || 
                    (client.subscription_tier === tier.id && client.subscription_status === 'active')
                  }
                  className="w-full border border-white/[0.08] px-4 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-50"
                >
                  {client.subscription_tier === tier.id && client.subscription_status === 'active'
                    ? 'Current Plan'
                    : checkoutMutation.isPending
                    ? 'Loading...'
                    : 'Subscribe'}
                </button>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}