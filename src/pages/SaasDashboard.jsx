import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Users, MessageSquare, DollarSign } from "lucide-react";

export default function SaasDashboard() {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['saasClients'],
    queryFn: () => base44.entities.SaasClient.list('-created_date')
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['widgetTransactions'],
    queryFn: () => base44.entities.WidgetTransaction.filter({ status: 'completed' })
  });

  const stats = {
    total_clients: clients.length,
    active_clients: clients.filter(c => c.subscription_status === 'active').length,
    total_revenue: clients.reduce((sum, c) => sum + (c.total_revenue_generated || 0), 0),
    peskoi_revenue: clients.reduce((sum, c) => sum + (c.peskoi_commission_earned || 0), 0),
    total_bookings: clients.reduce((sum, c) => sum + (c.total_bookings || 0), 0),
    total_conversations: clients.reduce((sum, c) => sum + (c.total_conversations || 0), 0),
    avg_conversion: clients.length > 0 
      ? (clients.reduce((sum, c) => sum + (c.conversion_rate || 0), 0) / clients.length).toFixed(1)
      : 0
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">
          SaaS Dashboard
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">{stats.active_clients}</p>
            <p className="text-[10px] sm:text-xs text-white/40">Active Clients</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">${Math.round(stats.peskoi_revenue)}</p>
            <p className="text-[10px] sm:text-xs text-white/40">Revenue (1%)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">{stats.total_bookings}</p>
            <p className="text-[10px] sm:text-xs text-white/40">Bookings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">{stats.avg_conversion}%</p>
            <p className="text-[10px] sm:text-xs text-white/40">Conversion</p>
          </motion.div>
        </div>

        {/* Clients List */}
        <div>
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Clients</p>
          <div className="space-y-4">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-white/[0.08] p-4 sm:p-6 hover:border-white/[0.15] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium mb-1 truncate">{client.business_name}</h3>
                    <p className="text-xs text-white/40 truncate">{client.owner_email}</p>
                  </div>
                  <span className={`text-[10px] sm:text-xs px-2 py-1 border self-start ${
                    client.subscription_status === 'active' 
                      ? 'border-green-500/30 text-green-400'
                      : 'border-white/10 text-white/40'
                  }`}>
                    {client.subscription_tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
                  <div>
                    <p className="text-white/40 mb-1">Revenue</p>
                    <p className="text-white/80">${Math.round(client.total_revenue_generated || 0)}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Commission</p>
                    <p className="text-white/80">${Math.round(client.peskoi_commission_earned || 0)}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Bookings</p>
                    <p className="text-white/80">{client.total_bookings || 0}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Conversations</p>
                    <p className="text-white/80">{client.total_conversations || 0}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}