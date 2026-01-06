import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import CalendarView from "../components/calendar/CalendarView";
import AppointmentModal from "../components/calendar/AppointmentModal";
import AppointmentsList from "../components/calendar/AppointmentsList";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" or "list"

  const queryClient = useQueryClient();

  const { data: squareBookings, isLoading } = useQuery({
    queryKey: ['squareBookings'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetBookings', {});
      return res.data?.bookings || [];
    }
  });

  // Transform Square bookings to match calendar format
  const appointments = React.useMemo(() => {
    if (!squareBookings) return [];
    
    return squareBookings.map(booking => {
      const segment = booking.appointment_segments?.[0];
      const startDate = new Date(booking.start_at);
      
      return {
        id: booking.id,
        square_booking_id: booking.id,
        customer_name: booking.customer_note || 'Guest',
        customer_phone: segment?.team_member_id || '',
        customer_email: '',
        service: segment?.service_variation_version?.name || 'Service',
        appointment_date: startDate.toISOString().split('T')[0],
        appointment_time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration_minutes: segment?.duration_minutes || 0,
        price: (segment?.service_variation_version?.price_money?.amount || 0) / 100,
        status: booking.status === 'ACCEPTED' ? 'bekräftad' : 'bokad',
        notes: booking.customer_note || ''
      };
    });
  }, [squareBookings]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Create in Square
      const res = await base44.functions.invoke('squareCreateBooking', {
        customer_note: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        start_at: `${data.appointment_date}T${data.appointment_time}:00`,
        service_variation_id: data.service_variation_id,
        team_member_id: data.team_member_id
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squareBookings'] });
      setShowModal(false);
      setEditingAppointment(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      // Update in Square
      const res = await base44.functions.invoke('squareUpdateBooking', {
        booking_id: id,
        customer_note: data.customer_name,
        start_at: `${data.appointment_date}T${data.appointment_time}:00`
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squareBookings'] });
      setShowModal(false);
      setEditingAppointment(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Cancel in Square
      const res = await base44.functions.invoke('squareCancelBooking', {
        booking_id: id
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squareBookings'] });
    },
  });

  const handleSave = (data) => {
    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Är du säker på att du vill radera denna bokning?')) {
      deleteMutation.mutate(id);
    }
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.appointment_date === today;
  });

  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.appointment_date >= today;
  });

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-2">Calendar</p>
            <p className="text-sm text-white/60">
              {todayAppointments.length} today • {upcomingAppointments.length} upcoming
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}
              className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wide"
            >
              {viewMode === "calendar" ? "LIST VIEW" : "CALENDAR VIEW"}
            </button>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CalendarView
                appointments={appointments}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onAppointmentClick={handleEdit}
              />
            </div>
            <div className="space-y-4">
              {todayAppointments.map(apt => (
                <div key={apt.id} className="border-b border-white/[0.05] pb-4">
                  <p className="text-sm mb-1">{apt.customer_name}</p>
                  <p className="text-xs text-white/40">{apt.service}</p>
                  <p className="text-xs text-white/30 mt-1">{apt.appointment_time}</p>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <p className="text-xs text-white/30">No bookings today</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map(apt => (
              <div key={apt.id} className="border-b border-white/[0.05] pb-4">
                <div className="flex justify-between mb-2">
                  <p className="text-sm">{apt.customer_name}</p>
                  <span className="text-xs text-white/40">{apt.status}</span>
                </div>
                <p className="text-xs text-white/40 mb-1">{apt.service}</p>
                <p className="text-xs text-white/30">
                  {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}