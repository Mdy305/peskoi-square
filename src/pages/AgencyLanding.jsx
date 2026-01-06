import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function AgencyLanding() {
  const [formData, setFormData] = useState({
    business_name: "",
    owner_email: "",
    owner_name: "",
    website_url: ""
  });

  // Get agency slug from URL
  const agencySlug = window.location.pathname.split('/agency/')[1];

  const { data: agency, isLoading } = useQuery({
    queryKey: ['agency', agencySlug],
    queryFn: async () => {
      const agencies = await base44.entities.Agency.filter({ agency_slug: agencySlug });
      return agencies[0];
    },
    enabled: !!agencySlug
  });

  const onboardMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('saasClientOnboard', {
        ...data,
        agency_id: agency.id,
        subscription_tier: 'trial'
      });
      return response.data;
    },
    onSuccess: async (data) => {
      // Track new client for agency
      await base44.functions.invoke('trackAgencyAnalytics', {
        agency_id: agency.id,
        event_type: 'client_added',
        client_id: data.client_id
      });
      
      window.location.href = `/saas-onboarding-success?client_id=${data.client_id}`;
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xs text-white/40 tracking-wide">Loading...</div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-white/60">Agency not found</p>
        </div>
      </div>
    );
  }

  const branding = agency.branding || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {branding.logo_url && (
            <img 
              src={branding.logo_url} 
              alt={agency.agency_name}
              className="h-12 mx-auto mb-6"
            />
          )}
          <h1 className="text-3xl font-light tracking-[0.3em] mb-4">
            {agency.agency_name}
          </h1>
          {branding.tagline && (
            <p className="text-sm text-white/60 tracking-wide">{branding.tagline}</p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-6">
                What You Get
              </p>
              <div className="space-y-4">
                {[
                  'AI-powered booking assistant',
                  '24/7 client communication',
                  'Square integration',
                  'Automated confirmations',
                  'Client retention tools'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-6">
              Get Started
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs text-white/40 block">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/40 block">Your Name</label>
                <input
                  type="text"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/40 block">Email</label>
                <input
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/40 block">Website (optional)</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                disabled={onboardMutation.isPending}
                className="w-full border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-50 mt-8"
              >
                {onboardMutation.isPending ? 'Creating Account...' : 'Start Free Trial'}
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}