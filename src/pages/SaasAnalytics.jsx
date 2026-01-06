import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, MessageSquare, DollarSign, Users } from "lucide-react";

export default function SaasAnalytics() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: clients = [] } = useQuery({
    queryKey: ['saasClients'],
    queryFn: () => base44.entities.SaasClient.list('-created_date')
  });

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['widgetAnalytics', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return null;
      const res = await base44.functions.invoke('analyzeWidgetPerformance', {
        saas_client_id: selectedClient
      });
      return res.data;
    },
    enabled: !!selectedClient,
    refetchInterval: 30000
  });

  const { data: catalog } = useQuery({
    queryKey: ['squareCatalog', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return null;
      const res = await base44.functions.invoke('getSquareCatalog', {
        saas_client_id: selectedClient
      });
      return res.data;
    },
    enabled: !!selectedClient
  });

  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0].id);
    }
  }, [clients]);

  if (isLoading || !analytics) {
    return <div className="min-h-screen bg-black" />;
  }

  const { metrics, service_breakdown, time_series, feedback_sentiment } = analytics;

  // Filter by category
  const filteredServices = categoryFilter === 'all' 
    ? service_breakdown 
    : service_breakdown.filter(s => {
        const item = catalog?.items?.find(i => i.name === s.name);
        return item?.category_id === categoryFilter;
      });

  const categoryBreakdown = catalog?.categories?.map(cat => {
    const services = service_breakdown.filter(s => {
      const item = catalog.items.find(i => i.name === s.name);
      return item?.category_id === cat.id;
    });
    return {
      name: cat.name,
      count: services.reduce((sum, s) => sum + s.count, 0),
      revenue: services.reduce((sum, s) => sum + s.revenue, 0)
    };
  }).filter(c => c.count > 0) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">
          Widget Analytics
        </p>

        {/* Client Selector */}
        {clients.length > 1 && (
          <div className="mb-12">
            <select
              value={selectedClient || ''}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full sm:w-auto bg-black border border-white/[0.08] px-4 py-3 text-sm focus:outline-none focus:border-white/20"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.business_name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">{metrics.total_conversations}</p>
            <p className="text-[10px] sm:text-xs text-white/40">Conversations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">{metrics.total_bookings}</p>
            <p className="text-[10px] sm:text-xs text-white/40">Bookings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">${Math.round(metrics.total_revenue)}</p>
            <p className="text-[10px] sm:text-xs text-white/40">Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-white/[0.08] p-4 sm:p-6"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-3 sm:mb-4" />
            <p className="text-2xl sm:text-3xl font-light mb-1 sm:mb-2">{metrics.conversion_rate}%</p>
            <p className="text-[10px] sm:text-xs text-white/40">Conversion</p>
          </motion.div>
        </div>

        {/* Time Series */}
        {time_series.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12 sm:mb-16"
          >
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">7-Day Trend</p>
            <div className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={time_series}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff20"
                    tick={{ fill: '#ffffff40', fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#ffffff20"
                    tick={{ fill: '#ffffff40', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#000', 
                      border: '1px solid #ffffff20',
                      borderRadius: 0,
                      fontSize: 11
                    }}
                    labelStyle={{ color: '#ffffff80' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversations" 
                    stroke="#ffffff60"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#ffffff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs text-white/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-white/60" />
                <span>Conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-white" />
                <span>Bookings</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mb-12 sm:mb-16"
          >
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Revenue by Category</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categoryBreakdown.map((cat, i) => (
                <div key={i} className="border border-white/[0.08] p-4">
                  <p className="text-sm text-white/80 mb-2">{cat.name}</p>
                  <p className="text-2xl font-light mb-1">${Math.round(cat.revenue)}</p>
                  <p className="text-xs text-white/40">{cat.count} bookings</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Service Breakdown */}
        {service_breakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12 sm:mb-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-xs text-white/30 tracking-[0.15em] uppercase">Revenue by Service</p>
              
              {catalog?.categories && catalog.categories.length > 0 && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-black border border-white/[0.08] px-3 py-2 text-xs focus:outline-none focus:border-white/20"
                >
                  <option value="all">All Categories</option>
                  {catalog.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="h-48 sm:h-64 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredServices.slice(0, 5)}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff20"
                    tick={{ fill: '#ffffff40', fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#ffffff20"
                    tick={{ fill: '#ffffff40', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#000', 
                      border: '1px solid #ffffff20',
                      borderRadius: 0,
                      fontSize: 11
                    }}
                    labelStyle={{ color: '#ffffff80' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="revenue" fill="#ffffff80" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {filteredServices.map((service, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                  <div>
                    <p className="text-sm text-white/80">{service.name}</p>
                    <p className="text-xs text-white/40">{service.count} bookings</p>
                  </div>
                  <p className="text-sm text-white/80">${Math.round(service.revenue)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback Sentiment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Feedback Sentiment</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-white/[0.08] p-4 text-center">
              <p className="text-2xl font-light mb-2">{feedback_sentiment.positive}</p>
              <p className="text-xs text-white/40">Positive</p>
            </div>
            <div className="border border-white/[0.08] p-4 text-center">
              <p className="text-2xl font-light mb-2">{feedback_sentiment.neutral}</p>
              <p className="text-xs text-white/40">Neutral</p>
            </div>
            <div className="border border-white/[0.08] p-4 text-center">
              <p className="text-2xl font-light mb-2">{feedback_sentiment.negative}</p>
              <p className="text-xs text-white/40">Negative</p>
            </div>
          </div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div className="border border-white/[0.08] p-6">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Customer Insights</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Unique customers</span>
                <span className="text-white/80">{metrics.unique_customers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Returning customers</span>
                <span className="text-white/80">{metrics.returning_customers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Avg booking value</span>
                <span className="text-white/80">${metrics.avg_booking_value}</span>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.08] p-6">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Performance</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Conversion rate</span>
                <span className="text-white/80">{metrics.conversion_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Total conversations</span>
                <span className="text-white/80">{metrics.total_conversations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Total bookings</span>
                <span className="text-white/80">{metrics.total_bookings}</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}