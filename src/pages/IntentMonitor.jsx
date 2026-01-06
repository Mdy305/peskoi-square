import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function IntentMonitor() {
  const { data: intents = [], isLoading } = useQuery({
    queryKey: ['customerIntents'],
    queryFn: async () => {
      const all = await base44.entities.CustomerIntent.filter({}, '-last_interaction', 50);
      return all;
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['squareCustomers'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetCustomers', {});
      return res.data?.customers || [];
    }
  });

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return 'Unknown';
    return `${customer.given_name || ''} ${customer.family_name || ''}`.trim() || customer.phone_number || 'Unknown';
  };

  const stateColors = {
    DISCOVERY: 'text-blue-400',
    SERVICE_SELECTION: 'text-yellow-400',
    AVAILABILITY_CHECK: 'text-purple-400',
    BOOKED: 'text-green-400',
    DROPPED_INTENT: 'text-red-400',
    FOLLOW_UP_SENT: 'text-white/40'
  };

  const activeIntents = intents.filter(i => !['BOOKED', 'DROPPED_INTENT', 'FOLLOW_UP_SENT'].includes(i.state));
  const completedIntents = intents.filter(i => i.state === 'BOOKED');
  const droppedIntents = intents.filter(i => i.state === 'DROPPED_INTENT');

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Intent Monitor</p>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="border border-white/[0.08] p-6">
            <p className="text-xs text-white/40 mb-2">Active</p>
            <p className="text-3xl font-light">{activeIntents.length}</p>
          </div>
          <div className="border border-white/[0.08] p-6">
            <p className="text-xs text-white/40 mb-2">Booked</p>
            <p className="text-3xl font-light">{completedIntents.length}</p>
          </div>
          <div className="border border-white/[0.08] p-6">
            <p className="text-xs text-white/40 mb-2">Dropped</p>
            <p className="text-3xl font-light">{droppedIntents.length}</p>
          </div>
        </div>

        {/* Active Intents */}
        {activeIntents.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Active conversations</p>
            <div className="space-y-4">
              {activeIntents.map((intent) => (
                <motion.div
                  key={intent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-white/[0.08] p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-white/80 mb-2">{getCustomerName(intent.square_customer_id)}</p>
                      <p className={`text-xs ${stateColors[intent.state]}`}>{intent.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40">{intent.channel}</p>
                      <p className="text-xs text-white/30 mt-1">
                        {new Date(intent.last_interaction).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {intent.intent_data && Object.keys(intent.intent_data).length > 0 && (
                    <div className="bg-white/[0.03] p-4 border-l-2 border-white/[0.08]">
                      <p className="text-xs text-white/40 mb-2">Intent data</p>
                      <div className="space-y-1 text-xs text-white/60">
                        {intent.intent_data.service_name && (
                          <p>Service: {intent.intent_data.service_name}</p>
                        )}
                        {intent.intent_data.preferred_date && (
                          <p>Date: {intent.intent_data.preferred_date}</p>
                        )}
                        {intent.intent_data.preferred_time && (
                          <p>Time: {intent.intent_data.preferred_time}</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Completed */}
        {completedIntents.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Recent bookings</p>
            <div className="space-y-3">
              {completedIntents.slice(0, 5).map((intent) => (
                <div key={intent.id} className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                  <div>
                    <p className="text-sm text-white/60">{getCustomerName(intent.square_customer_id)}</p>
                    {intent.intent_data?.service_name && (
                      <p className="text-xs text-white/40">{intent.intent_data.service_name}</p>
                    )}
                  </div>
                  <p className="text-xs text-green-400">BOOKED</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dropped Intents */}
        {droppedIntents.length > 0 && (
          <div>
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Dropped intents</p>
            <div className="space-y-3">
              {droppedIntents.slice(0, 5).map((intent) => (
                <div key={intent.id} className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                  <div>
                    <p className="text-sm text-white/60">{getCustomerName(intent.square_customer_id)}</p>
                    {intent.drop_reason && (
                      <p className="text-xs text-white/40">{intent.drop_reason}</p>
                    )}
                  </div>
                  <p className="text-xs text-red-400">DROPPED</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {intents.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">No customer intents tracked yet</p>
        )}

      </div>
    </div>
  );
}