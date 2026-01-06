import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Products() {
  const [analyzing, setAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["inventoryInsights"],
    queryFn: () => base44.entities.InventoryInsight.list("-analysis_date"),
    refetchOnWindowFocus: false,
    retry: false
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke("analyzeInventory", {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inventoryInsights"]);
      setAnalyzing(false);
    }
  });

  const handleAnalyze = () => {
    setAnalyzing(true);
    analyzeMutation.mutate();
  };

  const reorderNeeded = insights.filter(i => i.reorder_recommended);
  const critical = insights.filter(i => i.status === 'critical');
  const stagnant = insights.filter(i => i.status === 'stagnant');

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">

        {insights.length === 0 ? (
          <div className="space-y-8">
            <p className="text-white/40 text-sm tracking-wide">
              No inventory data
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="text-white/60 hover:text-white text-sm tracking-wide transition-colors disabled:opacity-40"
            >
              {analyzing ? 'Analyzing...' : 'Analyze inventory'}
            </button>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Critical Items */}
            {critical.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xs text-white/40 tracking-widest">CRITICAL</h2>
                {critical.map(item => (
                  <div key={item.id} className="border-b border-white/[0.05] pb-6">
                    <p className="text-white text-sm tracking-wide">{item.product_name}</p>
                    <p className="text-white/40 text-xs mt-2">
                      Out of stock — Reorder {item.suggested_quantity} units
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reorder Recommended */}
            {reorderNeeded.filter(i => i.status !== 'critical').length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xs text-white/40 tracking-widest">REORDER</h2>
                {reorderNeeded.filter(i => i.status !== 'critical').map(item => (
                  <div key={item.id} className="border-b border-white/[0.05] pb-6">
                    <p className="text-white/80 text-sm tracking-wide">{item.product_name}</p>
                    <p className="text-white/40 text-xs mt-2">
                      {item.current_stock} units — {item.predicted_days_remaining} days remaining
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      Suggested: {item.suggested_quantity} units
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Stagnant Items */}
            {stagnant.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xs text-white/40 tracking-widest">STAGNANT</h2>
                {stagnant.slice(0, 5).map(item => (
                  <div key={item.id} className="border-b border-white/[0.05] pb-6">
                    <p className="text-white/60 text-sm tracking-wide">{item.product_name}</p>
                    <p className="text-white/30 text-xs mt-2">
                      {item.current_stock} units — No sales in 90 days
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="text-white/40 hover:text-white/70 text-xs tracking-wide transition-colors disabled:opacity-40"
            >
              {analyzing ? 'Analyzing...' : 'Refresh analysis'}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}