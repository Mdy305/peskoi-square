import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function SystemHealthOverlay({ data }) {
  const { data: connection } = useQuery({
    queryKey: ['squareConnection'],
    queryFn: async () => {
      const connections = await base44.entities.SquareConnection.filter({ status: 'active' });
      return connections[0] || null;
    }
  });

  const { data: errors = [] } = useQuery({
    queryKey: ['systemErrors'],
    queryFn: () => base44.entities.ErrorLog.filter({ resolved: false }, '-timestamp', 10)
  });

  const squareConnected = !!connection;
  const criticalErrors = errors.filter(e => e.severity === 'S0' || e.severity === 'S1').length;
  const warnings = errors.filter(e => e.severity === 'S2').length;

  const systemStatus = !squareConnected ? 'blocked' : 
                       criticalErrors > 0 ? 'error' : 
                       warnings > 0 ? 'degraded' : 
                       'operational';

  const statusConfig = {
    operational: {
      icon: CheckCircle2,
      color: 'text-green-500',
      text: 'Operational'
    },
    degraded: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      text: 'Degraded'
    },
    error: {
      icon: XCircle,
      color: 'text-red-500',
      text: 'Error'
    },
    blocked: {
      icon: XCircle,
      color: 'text-red-500',
      text: 'Blocked'
    }
  };

  const status = statusConfig[systemStatus];
  const StatusIcon = status.icon;

  return (
    <div>
      <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">System Health</p>
      
      <div className="space-y-6">
        
        {/* Overall Status */}
        <div className="border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3 mb-2">
            <StatusIcon className={`w-6 h-6 ${status.color}`} />
            <span className="text-lg text-white/80">{status.text}</span>
          </div>
        </div>

        {/* Square Connection */}
        <div className="border-b border-white/[0.08] pb-6">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-4">Square Integration</p>
          {squareConnected ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-white/80">Connected</span>
              </div>
              <p className="text-xs text-white/60">{connection.location_name}</p>
              {connection.last_sync && (
                <p className="text-xs text-white/40 mt-1">
                  Last sync: {new Date(connection.last_sync).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-white/80">Not connected</span>
            </div>
          )}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div>
            <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-4">Recent Issues</p>
            <div className="space-y-4">
              {errors.slice(0, 5).map((error) => (
                <div key={error.id} className="border-b border-white/[0.05] pb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className={`w-4 h-4 mt-0.5 ${
                      error.severity === 'S0' || error.severity === 'S1' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white/80">{error.category}</p>
                      <p className="text-xs text-white/60 mt-1">{error.code}</p>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}