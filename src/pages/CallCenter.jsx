import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, CheckCircle2, XCircle, Play, Pause, Search, Calendar, Filter } from "lucide-react";

export default function CallCenter() {
  const [activeTab, setActiveTab] = useState("live");
  const [selectedCall, setSelectedCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isPlaying, setIsPlaying] = useState(null);

  const { data: callLogs, refetch } = useQuery({
    queryKey: ['callLogs', dateRange],
    queryFn: async () => {
      const res = await base44.entities.CallLog.list('-created_date', 200);
      return res;
    },
    refetchInterval: 5000
  });

  const filteredCalls = useMemo(() => {
    if (!callLogs) return [];
    
    return callLogs.filter(call => {
      const callDate = new Date(call.created_date).toISOString().split('T')[0];
      const dateMatch = callDate >= dateRange.start && callDate <= dateRange.end;
      const statusMatch = filterStatus === 'all' || call.status === filterStatus;
      const searchMatch = !searchQuery || 
        call.from_number?.includes(searchQuery) ||
        call.summary?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return dateMatch && statusMatch && searchMatch;
    });
  }, [callLogs, dateRange, filterStatus, searchQuery]);

  const metrics = useMemo(() => {
    const calls = filteredCalls || [];
    const completed = calls.filter(c => c.status === 'avslutad');
    const ongoing = calls.filter(c => c.status === 'pågående');
    const missed = calls.filter(c => c.status === 'missad');
    
    const totalDuration = completed.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
    const avgDuration = completed.length > 0 ? Math.round(totalDuration / completed.length) : 0;
    
    const booked = calls.filter(c => c.outcome === 'bokad').length;
    const conversionRate = completed.length > 0 ? Math.round((booked / completed.length) * 100) : 0;
    
    const totalCost = calls.reduce((sum, c) => sum + (c.cost_sek || 0), 0);

    return {
      total: calls.length,
      completed: completed.length,
      ongoing: ongoing.length,
      missed: missed.length,
      avgDuration,
      conversionRate,
      booked,
      totalCost: totalCost.toFixed(2)
    };
  }, [filteredCalls]);

  const liveCalls = useMemo(() => {
    return (callLogs || []).filter(c => c.status === 'pågående');
  }, [callLogs]);

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Unknown';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'bokad': return 'text-green-400';
      case 'information': return 'text-blue-400';
      case 'misslyckad': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'pågående':
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />;
      case 'avslutad':
        return <CheckCircle2 className="w-4 h-4 text-white/40" />;
      case 'missad':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-white/40" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-2">Call Center</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${liveCalls.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                  <span className="text-xs text-white/60">
                    {liveCalls.length > 0 ? `${liveCalls.length} active` : 'Monitoring'}
                  </span>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center gap-3 text-xs"
            >
              <Calendar className="w-4 h-4 text-white/30" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="bg-transparent border border-white/[0.08] px-3 py-1.5 text-white/80 focus:outline-none focus:border-white/20"
              />
              <span className="text-white/30">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="bg-transparent border border-white/[0.08] px-3 py-1.5 text-white/80 focus:outline-none focus:border-white/20"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Total calls', value: metrics.total, icon: Phone },
            { label: 'Conversion', value: `${metrics.conversionRate}%`, icon: CheckCircle2 },
            { label: 'Avg duration', value: formatDuration(metrics.avgDuration), icon: Clock },
            { label: 'Cost', value: `${metrics.totalCost} SEK`, icon: Phone }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
              className="border border-white/[0.08] p-6 hover:border-white/[0.15] transition-colors duration-300"
            >
              <metric.icon className="w-4 h-4 text-white/30 mb-4" />
              <p className="text-2xl font-light mb-1">{metric.value}</p>
              <p className="text-xs text-white/40">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex gap-8 mb-8 border-b border-white/[0.08]"
        >
          {['live', 'history', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs tracking-wide transition-all duration-300 ${
                activeTab === tab 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Live Calls */}
          {activeTab === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {liveCalls.length > 0 ? (
                <div className="space-y-4">
                  {liveCalls.map((call, index) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="border border-green-400/20 bg-green-400/[0.02] p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          <div>
                            <p className="text-sm text-white/90 mb-1">{formatPhone(call.from_number)}</p>
                            <p className="text-xs text-white/40">In progress</p>
                          </div>
                        </div>
                        <PhoneIncoming className="w-5 h-5 text-green-400" />
                      </div>

                      {call.transcript && (
                        <div className="bg-black/40 p-4 border-l-2 border-green-400/40">
                          <p className="text-xs text-white/60 font-mono leading-relaxed">
                            {call.transcript.slice(-200)}...
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-20"
                >
                  <Phone className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-sm text-white/40">No active calls</p>
                  <p className="text-xs text-white/30 mt-2">System monitoring 24/7</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by phone or summary..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border border-white/[0.08] pl-10 pr-4 py-2 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-black border border-white/[0.08] pl-10 pr-8 py-2 text-sm text-white/80 focus:outline-none focus:border-white/20 appearance-none"
                  >
                    <option value="all">All status</option>
                    <option value="avslutad">Completed</option>
                    <option value="missad">Missed</option>
                  </select>
                </div>
              </div>

              {/* Calls List */}
              <div className="space-y-2">
                {filteredCalls.map((call, index) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                    onClick={() => setSelectedCall(selectedCall?.id === call.id ? null : call)}
                    className="border border-white/[0.08] p-4 hover:border-white/[0.15] transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIndicator(call.status)}
                        <div>
                          <p className="text-sm text-white/90 mb-1">{formatPhone(call.from_number)}</p>
                          <p className="text-xs text-white/40">
                            {new Date(call.created_date).toLocaleDateString()} • {formatDuration(call.duration_seconds)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {call.outcome && (
                          <span className={`text-xs uppercase tracking-wider ${getOutcomeColor(call.outcome)}`}>
                            {call.outcome}
                          </span>
                        )}
                        {call.call_type === 'inkommande' ? (
                          <PhoneIncoming className="w-4 h-4 text-white/30" />
                        ) : (
                          <PhoneOutgoing className="w-4 h-4 text-white/30" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedCall?.id === call.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-white/[0.05] space-y-4"
                        >
                          {call.summary && (
                            <div>
                              <p className="text-xs text-white/30 mb-2">Summary</p>
                              <p className="text-sm text-white/70 leading-relaxed">{call.summary}</p>
                            </div>
                          )}

                          {call.transcript && (
                            <div>
                              <p className="text-xs text-white/30 mb-2">Transcript</p>
                              <div className="bg-white/[0.02] p-4 border-l-2 border-white/10 max-h-64 overflow-y-auto">
                                <p className="text-xs text-white/60 font-mono leading-relaxed whitespace-pre-wrap">
                                  {call.transcript}
                                </p>
                              </div>
                            </div>
                          )}

                          {call.recording_url && (
                            <div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPlaying(isPlaying === call.id ? null : call.id);
                                }}
                                className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
                              >
                                {isPlaying === call.id ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                                {isPlaying === call.id ? 'Pause' : 'Play'} recording
                              </button>
                            </div>
                          )}

                          {call.cost_sek && (
                            <div className="flex justify-between items-center pt-3 border-t border-white/[0.05]">
                              <p className="text-xs text-white/30">Call cost</p>
                              <p className="text-xs text-white/60">{call.cost_sek.toFixed(2)} SEK</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {filteredCalls.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-20"
                  >
                    <Phone className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-sm text-white/40">No calls found</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Outcome Breakdown */}
                <div className="border border-white/[0.08] p-6">
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Outcomes</p>
                  <div className="space-y-4">
                    {['bokad', 'information', 'ingen_åtgärd', 'misslyckad'].map((outcome) => {
                      const count = filteredCalls.filter(c => c.outcome === outcome).length;
                      const percentage = filteredCalls.length > 0 ? Math.round((count / filteredCalls.length) * 100) : 0;
                      
                      return (
                        <div key={outcome}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/70 capitalize">{outcome.replace('_', ' ')}</span>
                            <span className="text-sm text-white/40">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-1 bg-white/[0.05]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="h-full bg-white/40"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Call Types */}
                <div className="border border-white/[0.08] p-6">
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Call types</p>
                  <div className="space-y-6">
                    {['inkommande', 'utgående'].map((type) => {
                      const count = filteredCalls.filter(c => c.call_type === type).length;
                      const percentage = filteredCalls.length > 0 ? Math.round((count / filteredCalls.length) * 100) : 0;
                      
                      return (
                        <div key={type} className="text-center">
                          <p className="text-3xl font-light mb-2">{count}</p>
                          <p className="text-xs text-white/40 capitalize mb-2">{type}</p>
                          <p className="text-xs text-white/30">{percentage}% of total</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance */}
                <div className="border border-white/[0.08] p-6 lg:col-span-2">
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Performance</p>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="text-center">
                      <p className="text-3xl font-light mb-2">{metrics.booked}</p>
                      <p className="text-xs text-white/40">Bookings made</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-light mb-2">{metrics.missed}</p>
                      <p className="text-xs text-white/40">Missed calls</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-light mb-2">{formatDuration(metrics.avgDuration)}</p>
                      <p className="text-xs text-white/40">Avg call time</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}