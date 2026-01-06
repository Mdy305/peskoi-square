import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SquareConnectionStatus() {
  const { data: status, isLoading } = useQuery({
    queryKey: ["squareConnection"],
    queryFn: () => base44.functions.invoke("squareCheckConnection", {}),
    refetchInterval: 120000,
    retry: false,
    staleTime: 60000
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white/40 text-xs">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Checking Square connection...</span>
      </div>
    );
  }

  const isConnected = status?.data?.connected;

  if (!isConnected) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-white/60" />
            <div>
              <p className="text-white/80 text-sm tracking-wide">
                SYSTEM BLOCKED — Square not connected
              </p>
              <p className="text-white/40 text-xs mt-1 tracking-wide">
                Configure Square credentials to enable booking
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-white/40 text-xs tracking-wide">
      <span>Connected</span>
    </div>
  );
}