import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import BrainInsightCard from "@/components/brain/BrainInsightCard";
import { Calendar, Users, DollarSign, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useSquare } from "@/components/providers/SquareProvider";

export default function Dashboard() {
  const [realEvents, setRealEvents] = useState([]);
  const square = useSquare();

  // Fetch real Square metrics
  const { data: metricsData } = useQuery({
    queryKey: ["squareMetrics"],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetMetrics', {});
      return res.data;
    },
    enabled: square.connected,
    refetchInterval: 120000,
    retry: false
  });

  // Fetch appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => base44.entities.Appointment.list("-created_date"),
    enabled: square.connected,
    retry: false
  });

  // Fetch reputation events
  const { data: reputationEvents = [], isLoading: reputationLoading } = useQuery({
    queryKey: ["reputationEvents"],
    queryFn: () => base44.entities.ReputationEvent.list("-created_date"),
    enabled: square.connected,
    retry: false
  });

  // Fetch Brain insights
  const { data: brainData } = useQuery({
    queryKey: ["brainInsights"],
    queryFn: async () => {
      const res = await base44.functions.invoke('brainOrchestrator', {});
      return res.data;
    },
    enabled: square.connected,
    refetchInterval: 60000,
    retry: false
  });

  // Not connected state
  if (!square.loading && !square.connected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-6" />
          <h1 className="text-xl font-light mb-3">Square Required</h1>
          <p className="text-sm text-white/60 mb-8">
            Connect your Square account to access the dashboard.
          </p>
          <Link 
            to={createPageUrl("ConnectSquare")}
            className="inline-block border border-white/[0.08] px-8 py-3 text-sm tracking-wide hover:border-white/20 transition-colors"
          >
            Connect Square
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!square.connected) {
      setRealEvents([]);
      return;
    }

    // Combine appointments and reputation events
    const appointmentEvents = appointments.map(apt => ({
      id: apt.id,
      type: 'appointment',
      text: getEventText(apt),
      timestamp: new Date(apt.created_date),
      isGuest: apt.client_name === 'GUEST_INTERACTION',
      data: apt
    }));

    const reputationEventsList = reputationEvents.map(event => ({
      id: event.id,
      type: 'reputation',
      text: getReputationText(event),
      timestamp: new Date(event.created_date),
      isGuest: false,
      requiresAttention: event.requires_attention,
      data: event
    }));

    const allEvents = [...appointmentEvents, ...reputationEventsList]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    setRealEvents(prev => {
      if (JSON.stringify(prev) === JSON.stringify(allEvents)) {
        return prev;
      }
      return allEvents;
    });
  }, [appointments, reputationEvents, square.connected]);

  const getEventText = (apt) => {
    if (apt.client_name === 'GUEST_INTERACTION') {
      return apt.notes || 'Guest reached out';
    }
    if (apt.client_name === 'SYSTEM') {
      return apt.notes || 'System event';
    }
    if (apt.status === 'cancelled') {
      return 'Appointment cancelled';
    }
    if (apt.status === 'completed') {
      return 'Service completed';
    }
    return 'Appointment secured';
  };

  const getReputationText = (event) => {
    if (event.sentiment === 'negative') {
      return `Negative review detected — ${event.rating}★`;
    }
    if (event.sentiment === 'positive' && event.rating >= 4) {
      return `Positive review received — ${event.rating}★`;
    }
    return `Review received — ${event.rating}★`;
  };

  // Loading state
  if (square.loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  // Data loading
  if (appointmentsLoading || reputationLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  const metrics = metricsData || {
    upcomingBookings: 0,
    todayBookings: 0,
    newCustomers: 0,
    totalRevenue: 0
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Square Status */}
        {square.locationName && (
          <div className="mb-8 pb-8 border-b border-white/[0.05]">
            <p className="text-xs text-white/40">Connected: {square.locationName}</p>
          </div>
        )}

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <Link to={createPageUrl("Calendar")} className="group">
            <div className="border border-white/[0.08] p-6 hover:border-white/[0.15] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-4 h-4 text-white/40" />
                <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Today</p>
              </div>
              <p className="text-3xl font-light">{metrics.todayBookings}</p>
              <p className="text-xs text-white/40 mt-1">bookings</p>
            </div>
          </Link>

          <Link to={createPageUrl("Calendar")} className="group">
            <div className="border border-white/[0.08] p-6 hover:border-white/[0.15] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-4 h-4 text-white/40" />
                <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Upcoming</p>
              </div>
              <p className="text-3xl font-light">{metrics.upcomingBookings}</p>
              <p className="text-xs text-white/40 mt-1">bookings</p>
            </div>
          </Link>

          <Link to={createPageUrl("Clients")} className="group">
            <div className="border border-white/[0.08] p-6 hover:border-white/[0.15] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-4 h-4 text-white/40" />
                <p className="text-xs text-white/40 tracking-[0.15em] uppercase">New</p>
              </div>
              <p className="text-3xl font-light">{metrics.newCustomers}</p>
              <p className="text-xs text-white/40 mt-1">last 30 days</p>
            </div>
          </Link>

          <div className="border border-white/[0.08] p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-4 h-4 text-white/40" />
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Revenue</p>
            </div>
            <p className="text-3xl font-light">${metrics.totalRevenue}</p>
            <p className="text-xs text-white/40 mt-1">projected</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Brain Insights */}
          {brainData?.insights && brainData.insights.length > 0 && (
            <div className="mb-12 space-y-4">
              {brainData.insights.map((insight, idx) => (
                <BrainInsightCard key={idx} insight={insight} />
              ))}
            </div>
          )}

          {/* Real Events Only */}
          <div className="space-y-12">
            {realEvents.length === 0 ? null : (
              realEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-b border-white/[0.05] pb-8"
                >
                  <p className={`text-sm tracking-wide ${
                    event.requiresAttention ? 'text-white' : 'text-white/80'
                  }`}>
                    {event.text}
                  </p>
                  {event.requiresAttention && (
                    <p className="text-xs text-white/40 mt-2">
                      Requires attention
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}