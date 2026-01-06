import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react";

export default function SystemHealth() {
  const { data: health, isLoading, refetch } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => base44.functions.invoke('systemHealthCheck', {}),
    refetchInterval: 30000 // Auto-refresh every 30s
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xs text-white/40 tracking-wide">Loading...</div>
      </div>
    );
  }

  const healthData = health?.data;
  
  const getStatusIcon = (status) => {
    if (status === 'active' || status === 'configured') {
      return <CheckCircle2 className="w-4 h-4 text-white" />;
    }
    if (status === 'expired' || status === 'missing') {
      return <AlertCircle className="w-4 h-4 text-white/60" />;
    }
    return <XCircle className="w-4 h-4 text-white/40" />;
  };

  const getStatusText = (status) => {
    if (status === 'active' || status === 'configured') return 'Operational';
    if (status === 'expired') return 'Token Expired';
    if (status === 'missing') return 'Not Configured';
    if (status === 'disconnected') return 'Disconnected';
    return 'Error';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        
        <div className="flex items-center justify-between mb-12">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase">
            System Health
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        <div className="space-y-8">
          
          {/* Square Connection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-white/[0.08] pb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(healthData?.square_connection?.status)}
                <span className="text-sm tracking-wide">Square Connection</span>
              </div>
              <span className="text-xs text-white/40">
                {getStatusText(healthData?.square_connection?.status)}
              </span>
            </div>
            
            {healthData?.square_connection?.details && (
              <div className="ml-7 space-y-1 text-xs text-white/40">
                {healthData.square_connection.details.business_name && (
                  <p>Business: {healthData.square_connection.details.business_name}</p>
                )}
                {healthData.square_connection.details.merchant_id && (
                  <p>Merchant: {healthData.square_connection.details.merchant_id.substring(0, 16)}...</p>
                )}
                {healthData.square_connection.details.is_sandbox && (
                  <p className="text-white/60">Mode: Sandbox</p>
                )}
                {healthData.square_connection.details.message && (
                  <p className="text-white/60">{healthData.square_connection.details.message}</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Webhook Signature */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-b border-white/[0.08] pb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(healthData?.webhook_signature?.status)}
                <span className="text-sm tracking-wide">Webhook Signature</span>
              </div>
              <span className="text-xs text-white/40">
                {getStatusText(healthData?.webhook_signature?.status)}
              </span>
            </div>
            
            {!healthData?.webhook_signature?.configured && (
              <div className="ml-7 text-xs text-white/40">
                <p>Webhook signature key not configured in environment</p>
              </div>
            )}
          </motion.div>

          {/* Booking Success Rate */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {healthData?.booking_success_rate?.rate >= 80 ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : healthData?.booking_success_rate?.rate >= 50 ? (
                  <AlertCircle className="w-4 h-4 text-white/60" />
                ) : (
                  <XCircle className="w-4 h-4 text-white/40" />
                )}
                <span className="text-sm tracking-wide">Booking Success Rate</span>
              </div>
              <span className="text-lg tracking-wide">
                {healthData?.booking_success_rate?.rate}%
              </span>
            </div>
            
            <div className="ml-7 space-y-1 text-xs text-white/40">
              <p>Total: {healthData?.booking_success_rate?.total}</p>
              <p>Successful: {healthData?.booking_success_rate?.successful}</p>
              <p>Failed: {healthData?.booking_success_rate?.failed}</p>
            </div>
          </motion.div>

        </div>

        {healthData?.last_checked && (
          <div className="mt-12 text-xs text-white/30 text-center">
            Last checked: {new Date(healthData.last_checked).toLocaleTimeString()}
          </div>
        )}

      </div>
    </div>
  );
}