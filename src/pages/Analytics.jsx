import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar } from "lucide-react";

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { data: kpisData, isLoading } = useQuery({
    queryKey: ['squareKPIs'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getSquareKPIs', {});
      return res.data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: bookingsData } = useQuery({
    queryKey: ['squareBookings', dateRange],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetBookings', {});
      return res.data?.bookings || [];
    }
  });

  const filteredBookings = useMemo(() => {
    if (!bookingsData) return [];
    return bookingsData.filter(b => {
      const bookingDate = new Date(b.start_at).toISOString().split('T')[0];
      return bookingDate >= dateRange.start && bookingDate <= dateRange.end;
    });
  }, [bookingsData, dateRange]);

  const { data: predictions } = useQuery({
    queryKey: ['bookingTrends'],
    queryFn: async () => {
      const res = await base44.functions.invoke('predictBookingTrends', {});
      return res.data;
    },
    enabled: (bookingsData?.length || 0) >= 10
  });

  const { data: ltvAnalysis } = useQuery({
    queryKey: ['clientLTV'],
    queryFn: async () => {
      const res = await base44.functions.invoke('analyzeClientLTV', {});
      return res.data;
    },
    enabled: (bookingsData?.length || 0) >= 5
  });

  const { data: inventoryForecast } = useQuery({
    queryKey: ['inventoryForecast'],
    queryFn: async () => {
      const res = await base44.functions.invoke('forecastInventory', {});
      return res.data;
    },
    enabled: (bookingsData?.length || 0) >= 5
  });

  const bookings = filteredBookings || [];
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  // Service trends over time
  const serviceTrends = useMemo(() => {
    const trends = {};
    bookings.forEach(b => {
      const date = new Date(b.start_at).toISOString().split('T')[0];
      const service = b.appointment_segments?.[0]?.service_variation_version?.name;
      if (service) {
        if (!trends[date]) trends[date] = {};
        trends[date][service] = (trends[date][service] || 0) + 1;
      }
    });
    return Object.entries(trends)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, services]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...services
      }));
  }, [bookings]);

  // Stylist performance over time
  const stylistPerformance = useMemo(() => {
    const performance = {};
    completedBookings.forEach(b => {
      const stylist = b.appointment_segments?.[0]?.team_member_id || 'Unknown';
      const revenue = (b.appointment_segments?.[0]?.service_variation_version?.price_money?.amount || 0) / 100;
      if (!performance[stylist]) {
        performance[stylist] = { bookings: 0, revenue: 0 };
      }
      performance[stylist].bookings += 1;
      performance[stylist].revenue += revenue;
    });
    return Object.entries(performance).map(([stylist, data]) => ({
      stylist: stylist.slice(0, 8),
      bookings: data.bookings,
      revenue: Math.round(data.revenue)
    }));
  }, [completedBookings]);

  // Enhanced client segmentation
  const clientSegments = useMemo(() => {
    const clients = {};
    completedBookings.forEach(b => {
      const clientId = b.customer_id || 'walk-in';
      const revenue = (b.appointment_segments?.[0]?.service_variation_version?.price_money?.amount || 0) / 100;
      if (!clients[clientId]) {
        clients[clientId] = { visits: 0, revenue: 0, lastVisit: b.start_at };
      }
      clients[clientId].visits += 1;
      clients[clientId].revenue += revenue;
      if (new Date(b.start_at) > new Date(clients[clientId].lastVisit)) {
        clients[clientId].lastVisit = b.start_at;
      }
    });

    const segments = {
      vip: { clients: [], ltv: 0, avgVisits: 0, action: 'Maintain exclusive experience with priority booking' },
      high: { clients: [], ltv: 0, avgVisits: 0, action: 'Upsell premium services and loyalty program' },
      medium: { clients: [], ltv: 0, avgVisits: 0, action: 'Increase frequency with targeted offers' },
      standard: { clients: [], ltv: 0, avgVisits: 0, action: 'Convert to regular with first-visit incentives' }
    };

    Object.entries(clients).forEach(([id, data]) => {
      const ltv = data.revenue;
      const visits = data.visits;
      
      if (ltv > 500 && visits >= 5) {
        segments.vip.clients.push({ id, ...data, ltv });
      } else if (ltv > 250 && visits >= 3) {
        segments.high.clients.push({ id, ...data, ltv });
      } else if (ltv > 100 || visits >= 2) {
        segments.medium.clients.push({ id, ...data, ltv });
      } else {
        segments.standard.clients.push({ id, ...data, ltv });
      }
    });

    Object.keys(segments).forEach(key => {
      const seg = segments[key];
      seg.count = seg.clients.length;
      seg.ltv = seg.count > 0 ? Math.round(seg.clients.reduce((sum, c) => sum + c.ltv, 0) / seg.count) : 0;
      seg.avgVisits = seg.count > 0 ? (seg.clients.reduce((sum, c) => sum + c.visits, 0) / seg.count).toFixed(1) : 0;
    });

    return segments;
  }, [completedBookings]);
  
  const totalRevenue = completedBookings.reduce((sum, b) => {
    const price = b.appointment_segments?.[0]?.service_variation_version?.price_money?.amount || 0;
    return sum + price;
  }, 0) / 100;

  const avgBookingValue = completedBookings.length > 0 
    ? (totalRevenue / completedBookings.length).toFixed(0)
    : 0;

  const serviceBreakdown = {};
  bookings.forEach(b => {
    const serviceName = b.appointment_segments?.[0]?.service_variation_version?.name;
    if (serviceName) {
      serviceBreakdown[serviceName] = (serviceBreakdown[serviceName] || 0) + 1;
    }
  });

  const topServices = Object.entries(serviceBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const [sendingReport, setSendingReport] = useState(false);

  const handleSendReport = async () => {
    setSendingReport(true);
    try {
      await base44.functions.invoke('sendDailyReport', {});
      alert('Report sent to your email');
    } catch (error) {
      alert('Failed to send report');
    } finally {
      setSendingReport(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
      </div>
    );
  }

  const kpis = kpisData?.kpis || null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs text-white/40 tracking-[0.15em] uppercase"
          >
            Analytics
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-3 text-xs"
          >
            <button
              onClick={handleSendReport}
              disabled={sendingReport}
              className="border border-white/[0.08] px-4 py-2 hover:border-white/20 transition-colors disabled:opacity-30"
            >
              {sendingReport ? 'Sending...' : 'Email Report'}
            </button>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-4 sm:gap-8 mb-16 border-b border-white/[0.08] overflow-x-auto"
        >
          {['overview', 'trends', 'segments', 'predictions'].map((tab, index) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs tracking-wide transition-all duration-300 whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Overview */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Real-time KPIs */}
              {kpis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 pb-12 border-b border-white/[0.08]">
                  <div>
                    <p className="text-2xl font-light mb-2">{kpis.today.bookings}</p>
                    <p className="text-xs text-white/40">Today's bookings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light mb-2">${kpis.today.revenue.toFixed(0)}</p>
                    <p className="text-xs text-white/40">Today's revenue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light mb-2">{kpis.allTime.retentionRate}%</p>
                    <p className="text-xs text-white/40">Retention rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light mb-2">{kpis.allTime.noShowRate}%</p>
                    <p className="text-xs text-white/40">No-show rate</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                {[
                  { value: `$${totalRevenue.toFixed(0)}`, label: 'Revenue' },
                  { value: `$${avgBookingValue}`, label: 'Avg booking' },
                  { value: bookings.length, label: 'Bookings' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <p className="text-3xl font-light mb-2">{stat.value}</p>
                    <p className="text-xs text-white/40">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {topServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Top services</p>
                  <div className="space-y-3">
                    {topServices.map(([service, count], index) => (
                      <motion.div
                        key={service}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className="flex justify-between border-b border-white/[0.05] pb-3 hover:border-white/[0.12] transition-colors duration-300"
                      >
                        <p className="text-sm text-white/80">{service}</p>
                        <span className="text-xs text-white/40">{count}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Trends */}
          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Service Popularity Trends */}
              {serviceTrends.length > 0 && (
                <div className="mb-16">
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Service popularity</p>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={serviceTrends}>
                        <XAxis 
                          dataKey="date" 
                          stroke="#ffffff20"
                          tick={{ fill: '#ffffff40', fontSize: 11 }}
                        />
                        <YAxis 
                          stroke="#ffffff20"
                          tick={{ fill: '#ffffff40', fontSize: 11 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#000', 
                            border: '1px solid #ffffff20',
                            borderRadius: 0
                          }}
                          labelStyle={{ color: '#ffffff80' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        {Object.keys(serviceTrends[0] || {}).filter(k => k !== 'date').map((service, i) => (
                          <Line 
                            key={service}
                            type="monotone" 
                            dataKey={service} 
                            stroke={`hsl(${i * 60}, 70%, 60%)`}
                            strokeWidth={2}
                            dot={false}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Stylist Performance */}
              {stylistPerformance.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Stylist performance</p>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stylistPerformance}>
                        <XAxis 
                          dataKey="stylist" 
                          stroke="#ffffff20"
                          tick={{ fill: '#ffffff40', fontSize: 11 }}
                        />
                        <YAxis 
                          stroke="#ffffff20"
                          tick={{ fill: '#ffffff40', fontSize: 11 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#000', 
                            border: '1px solid #ffffff20',
                            borderRadius: 0
                          }}
                          labelStyle={{ color: '#ffffff80' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="bookings" fill="#ffffff40" />
                        <Bar dataKey="revenue" fill="#ffffff80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4 text-xs text-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white/40" />
                      <span>Bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white/80" />
                      <span>Revenue ($)</span>
                    </div>
                  </div>
                </div>
              )}

              {serviceTrends.length === 0 && stylistPerformance.length === 0 && (
                <p className="text-sm text-white/40">Insufficient data for trend analysis</p>
              )}
            </motion.div>
          )}

          {/* Segments */}
          {activeTab === 'segments' && (
            <motion.div
              key="segments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Client segmentation</p>
              
              <div className="space-y-6">
                {Object.entries(clientSegments).map(([tier, data], index) => (
                  <motion.div
                    key={tier}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="border border-white/[0.08] p-6 hover:border-white/[0.15] transition-colors duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-white/90 uppercase tracking-wider mb-1">{tier}</p>
                        <p className="text-xs text-white/40">{data.count} clients</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-light mb-1">${data.ltv}</p>
                        <p className="text-xs text-white/40">Avg LTV</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/[0.05]">
                      <div>
                        <p className="text-xs text-white/30 mb-1">Avg visits</p>
                        <p className="text-white/80">{data.avgVisits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/30 mb-1">Total revenue</p>
                        <p className="text-white/80">${Math.round(data.ltv * data.count)}</p>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] p-3 border-l-2 border-white/20">
                      <p className="text-xs text-white/30 mb-1">Action</p>
                      <p className="text-xs text-white/70">{data.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Predictions */}
          {activeTab === 'predictions' && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
            {predictions?.success ? (
              <div className="space-y-12">
                <div>
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">30-day forecast</p>
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-2xl font-light mb-2">
                        {predictions.prediction.next_30_days_bookings?.predicted_total || 'N/A'}
                      </p>
                      <p className="text-xs text-white/40">Expected bookings</p>
                    </div>
                    <div>
                      <p className="text-2xl font-light mb-2">
                        ${predictions.prediction.revenue_forecast?.predicted_total?.toFixed(0) || 'N/A'}
                      </p>
                      <p className="text-xs text-white/40">Expected revenue</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60">
                    Trend: {predictions.prediction.next_30_days_bookings?.trend || 'Unknown'}
                  </p>
                </div>

                {predictions.prediction.peak_times?.length > 0 && (
                  <div>
                    <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Peak times</p>
                    <div className="space-y-3">
                      {predictions.prediction.peak_times.map((peak, i) => (
                        <div key={i} className="border-b border-white/[0.05] pb-3">
                          <p className="text-sm text-white/80">{peak.day} at {peak.time}</p>
                          <p className="text-xs text-white/40 mt-1">{peak.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {predictions.prediction.recommendations?.length > 0 && (
                  <div>
                    <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Recommendations</p>
                    <div className="space-y-2">
                      {predictions.prediction.recommendations.map((rec, i) => (
                        <p key={i} className="text-sm text-white/60">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-white/40">Insufficient booking history for predictions</p>
            )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}