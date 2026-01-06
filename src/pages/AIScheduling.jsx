import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Brain, Calendar, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSquare } from "@/components/providers/SquareProvider";

export default function AIScheduling() {
  const square = useSquare();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetServices', {});
      return res.data.services || [];
    },
    enabled: square.connected
  });

  // Fetch demand prediction
  const { data: demand, isLoading: demandLoading } = useQuery({
    queryKey: ['demandPrediction'],
    queryFn: async () => {
      const res = await base44.functions.invoke('aiDemandPredictor', {});
      return res.data;
    },
    enabled: square.connected
  });

  // Get AI suggestions
  const suggestionsMutation = useMutation({
    mutationFn: async (data) => {
      const res = await base44.functions.invoke('aiSchedulingSuggestions', data);
      return res.data;
    }
  });

  if (square.loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (!square.connected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <Brain className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-sm text-white/60">Connect Square to access AI scheduling</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light mb-2 flex items-center gap-3">
            <Brain className="w-6 h-6" />
            AI Scheduling Intelligence
          </h1>
          <p className="text-sm text-white/60">
            Predictive analytics and smart recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Demand Prediction */}
          <div className="border border-white/[0.08] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-white/60" />
              <h2 className="text-lg font-light">Demand Forecast</h2>
            </div>

            {demandLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-white/40" />
              </div>
            ) : demand?.prediction ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/40 mb-2">Peak Hours</p>
                  <div className="flex flex-wrap gap-2">
                    {demand.prediction.peak_hours?.map((hour, i) => (
                      <span key={i} className="text-xs border border-white/[0.08] px-2 py-1">
                        {hour}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-white/40 mb-2">Peak Days</p>
                  <div className="flex flex-wrap gap-2">
                    {demand.prediction.peak_days?.map((day, i) => (
                      <span key={i} className="text-xs border border-white/[0.08] px-2 py-1">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-white/40 mb-2">Trending Services</p>
                  <div className="space-y-2">
                    {demand.prediction.trending_services?.map((svc, i) => (
                      <div key={i} className="border border-white/[0.08] p-3">
                        <p className="text-sm mb-1">{svc.service_name}</p>
                        <p className="text-xs text-white/60">{svc.trend}</p>
                        <p className="text-xs text-white/40 mt-1">{svc.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-white/40 mb-2">Capacity Analysis</p>
                  <p className="text-sm text-white/80">{demand.prediction.capacity_analysis}</p>
                </div>

                <div>
                  <p className="text-xs text-white/40 mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {demand.prediction.scheduling_recommendations?.map((rec, i) => (
                      <li key={i} className="text-sm text-white/80">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/40">No prediction data available</p>
            )}
          </div>

          {/* Smart Suggestions */}
          <div className="border border-white/[0.08] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-white/60" />
              <h2 className="text-lg font-light">Booking Optimizer</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-2 block">Select Service</label>
                <select
                  className="w-full bg-black border border-white/[0.08] px-3 py-2 text-sm"
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Choose service...</option>
                  {services?.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => {
                  if (!selectedService) return;
                  suggestionsMutation.mutate({
                    service_id: selectedService,
                    preferred_date: new Date().toISOString().split('T')[0]
                  });
                }}
                disabled={!selectedService || suggestionsMutation.isPending}
                className="w-full"
              >
                {suggestionsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Get AI Suggestions'
                )}
              </Button>

              {suggestionsMutation.data?.suggestions && (
                <div className="space-y-3 mt-4">
                  <p className="text-xs text-white/60">AI-Recommended Slots:</p>
                  {suggestionsMutation.data.suggestions.map((suggestion, i) => (
                    <div key={i} className="border border-white/[0.08] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">
                          {new Date(suggestion.slot.start_at).toLocaleString()}
                        </span>
                        <span className="text-xs text-white/60">
                          Score: {Math.round(suggestion.score * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-white/40">{suggestion.reasoning}</p>
                    </div>
                  ))}
                  
                  {suggestionsMutation.data.insight && (
                    <div className="border-t border-white/[0.08] pt-3 mt-3">
                      <p className="text-xs text-white/60">AI Insight:</p>
                      <p className="text-sm text-white/80 mt-1">
                        {suggestionsMutation.data.insight}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}