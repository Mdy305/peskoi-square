import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function Appointments() {
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['squareBookings'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetBookings', {});
      return res.data?.bookings || [];
    }
  });

  const bookings = bookingsData || [];

  const appointments = bookings.map(booking => {
    const segment = booking.appointment_segments?.[0];
    const startDate = new Date(booking.start_at);
    
    return {
      id: booking.id,
      client_name: booking.customer_note || 'Guest',
      service: segment?.service_variation_version?.name || 'Service',
      date: startDate.toISOString().split('T')[0],
      time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: booking.status === 'COMPLETED' ? 'completed' : 
              booking.status === 'CANCELLED' ? 'cancelled' : 'scheduled'
    };
  });

  const filteredAppointments = appointments.filter(apt => {
    return filterStatus === "all" || apt.status === filterStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-1 bg-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12"
        >
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Appointments</p>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black border border-white/[0.08] text-xs text-white/60 px-3 py-2 focus:outline-none hover:border-white/20 transition-colors duration-300"
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {filteredAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="border-b border-white/[0.05] pb-4 mb-3 hover:border-white/[0.12] transition-colors duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-sm mb-1">{apt.client_name}</p>
                  <p className="text-xs text-white/40">{apt.service}</p>
                </div>
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className="text-xs text-white/30"
                >
                  {apt.status}
                </motion.span>
              </div>
              <p className="text-xs text-white/30">
                {new Date(apt.date).toLocaleDateString()} at {apt.time}
              </p>
            </motion.div>
          ))}

          {filteredAppointments.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-sm text-white/40 text-center py-12"
            >
              No appointments
            </motion.p>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}