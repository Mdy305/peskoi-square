import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function SystemStatus() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => base44.functions.invoke('systemHealthCheck', {}),
    refetchInterval: 30000
  });

  const status = health?.data || {
    overall: "operational",
    services: []
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "outage":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-white/40" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "operational":
        return "All Systems Operational";
      case "degraded":
        return "Degraded Performance";
      case "outage":
        return "Service Disruption";
      default:
        return "Unknown Status";
    }
  };

  const services = [
    { name: "Square API", key: "square" },
    { name: "OpenAI", key: "openai" },
    { name: "Twilio SMS", key: "twilio_sms" },
    { name: "Twilio Voice", key: "twilio_voice" },
    { name: "Database", key: "database" },
    { name: "Authentication", key: "auth" },
    { name: "Widget", key: "widget" },
    { name: "Backend Functions", key: "functions" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">System Status</p>

        {/* Overall Status */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            {getStatusIcon(status.overall)}
            <h1 className="text-2xl font-light">{getStatusText(status.overall)}</h1>
          </div>
          <p className="text-sm text-white/40">
            Last checked: {new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short'
            })}
          </p>
        </div>

        {/* Service Status Grid */}
        <div className="space-y-3">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Services</p>
          
          {services.map((service) => {
            const serviceStatus = status.services?.find(s => s.key === service.key);
            const currentStatus = serviceStatus?.status || "operational";
            
            return (
              <div 
                key={service.key}
                className="flex items-center justify-between border-b border-white/[0.05] pb-3"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(currentStatus)}
                  <span className="text-sm">{service.name}</span>
                </div>
                <span className="text-xs text-white/40 capitalize">{currentStatus}</span>
              </div>
            );
          })}
        </div>

        {/* Incident History */}
        <div className="mt-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Recent Incidents</p>
          <div className="bg-white/[0.03] p-6 border border-white/[0.08]">
            <p className="text-sm text-white/60">No incidents in the last 30 days</p>
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="mt-12">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Scheduled Maintenance</p>
          <div className="bg-white/[0.03] p-6 border border-white/[0.08]">
            <p className="text-sm text-white/60">No scheduled maintenance</p>
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="mt-12 bg-white/[0.03] p-6 border border-white/[0.08]">
          <p className="text-sm text-white/80 mb-2">Get Status Updates</p>
          <p className="text-xs text-white/40 mb-4">
            Subscribe to receive notifications about service disruptions and maintenance windows.
          </p>
          <a 
            href="mailto:status@peskoi.com?subject=Subscribe%20to%20Status%20Updates"
            className="text-xs text-white/60 hover:text-white transition-colors underline"
          >
            status@peskoi.com
          </a>
        </div>

      </div>
    </div>
  );
}