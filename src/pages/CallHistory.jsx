import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle, Info, AlertCircle, ChevronRight } from "lucide-react";

export default function CallHistory() {
  const [filter, setFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState(null);

  const { data: callLogs = [], isLoading } = useQuery({
    queryKey: ['callLogs'],
    queryFn: () => base44.entities.CallLog.list('-created_date')
  });

  const filteredCalls = callLogs.filter(call => 
    filter === "all" || call.outcome === filter
  );

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'bokad':
      case 'booked':
        return <CheckCircle className="w-4 h-4 text-white/60" />;
      case 'information':
        return <Info className="w-4 h-4 text-white/40" />;
      case 'misslyckad':
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-white/30" />;
      default:
        return <Phone className="w-4 h-4 text-white/30" />;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Unknown';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Calls</p>
          <div className="flex gap-2">
            {['all', 'bokad', 'information'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 text-xs tracking-wide transition-all ${
                  filter === option
                    ? 'bg-white text-black'
                    : 'border border-white/[0.08] text-white/40 hover:text-white/70'
                }`}
              >
                {option === 'all' ? 'All' : option === 'bokad' ? 'Booked' : 'Info'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {filteredCalls.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
                onClick={() => setSelectedCall(selectedCall?.id === call.id ? null : call)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03]">
                        {getOutcomeIcon(call.outcome)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 font-light tracking-wide">
                          {formatPhone(call.from_number)}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                          <span>{new Date(call.created_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}</span>
                          <span>•</span>
                          <span>{formatDuration(call.duration_seconds)}</span>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: selectedCall?.id === call.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {selectedCall?.id === call.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-white/[0.05] space-y-4">
                          {call.summary && (
                            <div>
                              <p className="text-xs text-white/30 tracking-wide uppercase mb-2">Summary</p>
                              <p className="text-sm text-white/60 leading-relaxed">{call.summary}</p>
                            </div>
                          )}
                          {call.transcript && (
                            <div>
                              <p className="text-xs text-white/30 tracking-wide uppercase mb-2">Transcript</p>
                              <div className="bg-white/[0.02] p-4 rounded text-xs text-white/50 leading-relaxed max-h-60 overflow-y-auto">
                                {call.transcript}
                              </div>
                            </div>
                          )}
                          {call.appointment_id && (
                            <div>
                              <p className="text-xs text-white/30 tracking-wide uppercase mb-2">Result</p>
                              <p className="text-sm text-white/60">Booking created</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCalls.length === 0 && (
            <div className="text-center py-20">
              <Phone className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-sm text-white/40">No calls yet</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}