import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export default function AgencyDashboard() {
  const [copied, setCopied] = React.useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: agencies = [] } = useQuery({
    queryKey: ['userAgencies'],
    queryFn: () => base44.entities.Agency.filter({ created_by: user?.email }),
    enabled: !!user
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['agencyClients'],
    queryFn: async () => {
      if (!agencies[0]) return [];
      return base44.entities.SaasClient.filter({ agency_id: agencies[0].id });
    },
    enabled: agencies.length > 0
  });

  const agency = agencies[0];

  const handleCopyLink = () => {
    if (!agency) return;
    const landingUrl = `${window.location.origin}/agency/${agency.agency_slug}`;
    navigator.clipboard.writeText(landingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!agency) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <p className="text-sm text-white/60 text-center">No agency found. Contact support to set up your agency.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">
          Agency Overview
        </p>

        <div className="space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-light tracking-wide">{agency.agency_name}</h2>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/[0.03] p-3 border border-white/[0.08] text-xs break-all">
                {window.location.origin}/agency/{agency.agency_slug}
              </div>
              <button
                onClick={handleCopyLink}
                className="p-3 border border-white/[0.08] hover:border-white/20 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-6"
          >
            <div className="border-b border-white/[0.08] pb-4">
              <div className="text-2xl font-light mb-1">{agency.total_clients || 0}</div>
              <div className="text-xs text-white/40 tracking-wide">Active Clients</div>
            </div>
            
            <div className="border-b border-white/[0.08] pb-4">
              <div className="text-2xl font-light mb-1">
                ${((agency.total_revenue || 0) / 100).toFixed(0)}
              </div>
              <div className="text-xs text-white/40 tracking-wide">Total Revenue</div>
            </div>
            
            <div className="border-b border-white/[0.08] pb-4">
              <div className="text-2xl font-light mb-1">
                ${((agency.agency_commission_earned || 0) / 100).toFixed(0)}
              </div>
              <div className="text-xs text-white/40 tracking-wide">Commission Earned</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs text-white/40 tracking-[0.15em] uppercase">
              Your Clients
            </p>
            
            {clients.length === 0 ? (
              <p className="text-sm text-white/40">No clients yet. Share your landing page to get started.</p>
            ) : (
              <div className="space-y-3">
                {clients.map((client) => (
                  <div key={client.id} className="border border-white/[0.08] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm tracking-wide">{client.business_name}</p>
                        <p className="text-xs text-white/40 mt-1">{client.owner_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/40">{client.total_bookings || 0} bookings</p>
                        <p className="text-xs text-white/60 mt-1">
                          ${((client.total_revenue_generated || 0) / 100).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

      </div>
    </div>
  );
}