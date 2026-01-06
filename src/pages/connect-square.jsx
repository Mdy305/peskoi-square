import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";

export default function ConnectSquare() {
  const [connecting, setConnecting] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Square Connection</p>
        
        <h1 className="text-2xl font-light mb-4 tracking-wide">
          Connect your Square account
        </h1>
        
        <p className="text-sm text-white/60 mb-12 leading-relaxed">
          PESKOI needs access to your Square account to manage bookings, services, and customer data.
        </p>

        <button
          onClick={() => connectMutation.mutate()}
          disabled={connectMutation.isPending}
          className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-all text-sm tracking-wide"
        >
          {connectMutation.isPending ? 'Connecting...' : 'Connect Square'}
        </button>

        {connectMutation.isError && (
          <div className="mt-6 p-4 border border-red-500/20 bg-red-500/5">
            <p className="text-xs text-red-400 mb-2">Connection failed</p>
            <p className="text-xs text-white/40">
              {connectMutation.error?.response?.data?.error || connectMutation.error?.message || 'Please check your Square OAuth configuration'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}