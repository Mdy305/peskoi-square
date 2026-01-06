import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";

export default function CallAgentStatusOverlay({ data }) {
  const { data: callLogs = [] } = useQuery({
    queryKey: ['callLogs'],
    queryFn: () => base44.entities.CallLog.list('-created_date', 20)
  });

  const { data: business } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const businesses = await base44.entities.Business.list();
      return businesses[0] || null;
    }
  });

  const recentCalls = callLogs.slice(0, 5);
  const callsToday = callLogs.filter(call => {
    const callDate = new Date(call.created_date);
    const today = new Date();
    return callDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div>
      <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Call Agent</p>
      
      {business?.twilio_phone_number ? (
        <div className="space-y-6">
          <div className="border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-green-500" />
              <span className="text-sm text-white/80">Active</span>
            </div>
            <p className="text-sm text-white/60 mb-2">{business.twilio_phone_number}</p>
            <p className="text-xs text-white/40">{callsToday} calls today</p>
          </div>

          {recentCalls.length > 0 && (
            <div>
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-4">Recent Calls</p>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="border-b border-white/[0.05] pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/80">{call.from_number}</span>
                      <span className="text-xs text-white/40">{call.duration_seconds}s</span>
                    </div>
                    <p className="text-xs text-white/60">
                      {call.outcome === 'bokad' ? 'Booked' : call.outcome}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(call.created_date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <Phone className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-sm text-white/60 mb-6">Call agent not configured</p>
          <p className="text-xs text-white/40">Configure Twilio phone number to enable AI call handling</p>
        </div>
      )}
    </div>
  );
}