import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, RefreshCw, Loader2, Zap, AlertCircle } from "lucide-react";

export default function SquareSync() {
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery({
    queryKey: ['squareSyncStatus'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareSyncStatus', {});
      return res.data;
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  const setupWebhookMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('squareWebhookSetup', {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squareSyncStatus'] });
    }
  });

  const syncBookingsMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('squareSyncBookings', {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squareSyncStatus'] });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (!status?.connected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-8">
            <XCircle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-light">Square Not Connected</h1>
          </div>
          <p className="text-sm text-white/60 mb-6">
            Connect your Square account to enable automated sync.
          </p>
        </div>
      </div>
    );
  }

  const { connection, webhook, sync_stats } = status;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Square Sync</p>

        <h1 className="text-2xl font-light mb-12">Automated Synchronization</h1>

        {/* Connection Status */}
        <div className="mb-12 bg-white/[0.03] border border-white/[0.08] p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium">Square Connected</p>
          </div>
          <div className="space-y-3 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Location</span>
              <span className="text-white/80">{connection.location_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Environment</span>
              <span className="text-white/80">{connection.environment}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Sync</span>
              <span className="text-white/80">
                {connection.last_sync 
                  ? new Date(connection.last_sync).toLocaleString() 
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Webhook Status */}
        <div className="mb-12 bg-white/[0.03] border border-white/[0.08] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {webhook.configured ? (
                <Zap className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <p className="text-sm font-medium">Real-Time Webhooks</p>
            </div>
            {!webhook.configured && (
              <button
                onClick={() => setupWebhookMutation.mutate()}
                disabled={setupWebhookMutation.isPending}
                className="border border-white/[0.08] px-4 py-1.5 text-xs hover:border-white/20 transition-colors disabled:opacity-50"
              >
                {setupWebhookMutation.isPending ? 'Setting up...' : 'Enable Webhooks'}
              </button>
            )}
          </div>

          {webhook.configured ? (
            <div className="space-y-2 text-xs text-white/60">
              <p className="text-white/80">✓ Webhooks enabled</p>
              <p>Events: {webhook.event_types.join(', ')}</p>
            </div>
          ) : (
            <p className="text-xs text-white/60">
              Enable webhooks for instant updates when bookings or customers change in Square.
            </p>
          )}

          {setupWebhookMutation.error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {setupWebhookMutation.error.message}
            </div>
          )}
        </div>

        {/* Sync Stats */}
        <div className="mb-12 bg-white/[0.03] border border-white/[0.08] p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium">Sync Statistics</p>
            <button
              onClick={() => syncBookingsMutation.mutate()}
              disabled={syncBookingsMutation.isPending}
              className="flex items-center gap-2 border border-white/[0.08] px-4 py-1.5 text-xs hover:border-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${syncBookingsMutation.isPending ? 'animate-spin' : ''}`} />
              Manual Sync
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-white/40 mb-1">Total Appointments</p>
              <p className="text-2xl font-light">{sync_stats.total_appointments}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Total Customers</p>
              <p className="text-2xl font-light">{sync_stats.total_customers}</p>
            </div>
          </div>

          {sync_stats.recent_activity?.length > 0 && (
            <div>
              <p className="text-xs text-white/40 mb-3">Recent Activity</p>
              <div className="space-y-2">
                {sync_stats.recent_activity.map((activity, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-white/60 py-2 border-b border-white/[0.05]">
                    <span>{activity.client_name}</span>
                    <span className="text-white/40">{activity.service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-white/[0.03] border border-white/[0.08] p-6">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">How It Works</p>
          <div className="space-y-4 text-xs text-white/60">
            <div>
              <p className="text-white/80 mb-1">→ PESKOI to Square</p>
              <p>All bookings created in PESKOI are instantly pushed to Square Appointments</p>
            </div>
            <div>
              <p className="text-white/80 mb-1">→ Square to PESKOI</p>
              <p>Changes in Square (cancellations, reschedules, new bookings) sync automatically via webhooks</p>
            </div>
            <div>
              <p className="text-white/80 mb-1">→ Real-Time Updates</p>
              <p>No manual sync required—everything happens automatically in the background</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}