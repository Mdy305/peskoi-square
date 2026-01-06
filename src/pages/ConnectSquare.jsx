import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import VoiceCommand from "@/components/brain/VoiceCommand";

export default function ConnectSquare() {
  // Check current connection status
  const { data: connection, isLoading, error } = useQuery({
    queryKey: ['squareConnection'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        if (!user?.square_merchant_id) return null;
        
        const connections = await base44.entities.SquareConnection.filter({ 
          merchant_id: user.square_merchant_id,
          status: 'active' 
        });
        return connections[0] || null;
      } catch (err) {
        console.error('Query error:', err);
        return null;
      }
    },
    retry: false
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('squareOAuthInit', {});
      return res.data;
    },
    onSuccess: (data) => {
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (error) {
    console.error('Connection check error:', error);
  }

  if (connection) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-6 sm:mb-8" />
          <h1 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Square Connected</h1>
          <p className="text-xs sm:text-sm text-white/60 mb-8 sm:mb-12">
            {connection.location_name || 'Your account'} is connected
          </p>
          <Link 
            to={createPageUrl("Dashboard")}
            className="inline-block border border-white/[0.08] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm tracking-wide hover:border-white/20 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full text-center">
        
        <h1 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 tracking-[0.2em]">PESKOI</h1>
        <p className="text-xs sm:text-sm text-white/60 mb-8 sm:mb-12 leading-relaxed">
          Connect your Square account to begin.
        </p>

        {connectMutation.error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-500/10 border border-red-500/20 text-left">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-red-400 mb-1 font-medium">Connection Failed</p>
                <p className="text-xs text-white/60 break-words">
                  {connectMutation.error?.response?.data?.error || connectMutation.error?.message || 'Configuration error'}
                </p>
                {connectMutation.error?.response?.data?.message && (
                  <p className="text-xs text-white/40 mt-2">
                    {connectMutation.error.response.data.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => connectMutation.mutate()}
          disabled={connectMutation.isPending}
          className="w-full border border-white/[0.08] px-6 py-2.5 sm:py-3 text-xs sm:text-sm tracking-wide hover:border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {connectMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Square Account'
          )}
        </button>

        <div className="mt-8 sm:mt-12 pt-8 border-t border-white/[0.08]">
          <p className="text-xs text-white/40 mb-3 sm:mb-4">
            Need help with OAuth setup?
          </p>
          <Link 
            to={createPageUrl("SquareSetup")}
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
          >
            View Setup Instructions
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

      </div>
      
      <VoiceCommand />
    </div>
  );
}