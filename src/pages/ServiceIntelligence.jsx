import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ServiceIntelligence() {
  const queryClient = useQueryClient();

  const { data: intelligence, isLoading } = useQuery({
    queryKey: ['serviceIntelligence'],
    queryFn: async () => {
      const res = await base44.functions.invoke('analyzeServiceIntelligence', {});
      return res.data;
    },
    refetchOnWindowFocus: false
  });

  const refreshAnalysis = useMutation({
    mutationFn: () => base44.functions.invoke('analyzeServiceIntelligence', {}),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceIntelligence']);
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!intelligence?.success) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-white/40">No booking data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-16">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Service intelligence</p>
          <button
            onClick={() => refreshAnalysis.mutate()}
            disabled={refreshAnalysis.isPending}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            {refreshAnalysis.isPending ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-8 mb-16">
          <div>
            <p className="text-3xl font-light mb-2">{intelligence.summary.total_services}</p>
            <p className="text-xs text-white/40">Services</p>
          </div>
          <div>
            <p className="text-3xl font-light mb-2">{intelligence.summary.total_bookings}</p>
            <p className="text-xs text-white/40">Bookings</p>
          </div>
          <div>
            <p className="text-3xl font-light mb-2">${intelligence.summary.total_revenue.toFixed(0)}</p>
            <p className="text-xs text-white/40">Revenue</p>
          </div>
          <div>
            <p className="text-3xl font-light mb-2">${intelligence.summary.avg_booking_value}</p>
            <p className="text-xs text-white/40">Avg value</p>
          </div>
        </div>

        {/* Top Services */}
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Performance</p>
          <div className="space-y-3">
            {intelligence.services.slice(0, 10).map(service => (
              <div key={service.service_id} className="border-b border-white/[0.05] pb-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">{service.name}</p>
                  <span className="text-xs text-white/40">{service.bookings} bookings</span>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>${service.avg_price.toFixed(0)} avg</span>
                  <span>{service.revenue_share}% revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Opportunities */}
        {intelligence.insights?.pricing_opportunities?.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Pricing opportunities</p>
            <div className="space-y-4">
              {intelligence.insights.pricing_opportunities.map((opp, i) => (
                <div key={i} className="border border-white/[0.08] p-6">
                  <p className="text-sm mb-2">{opp.service}</p>
                  <div className="flex gap-8 text-xs text-white/60 mb-3">
                    <span>Current: ${opp.current_price.toFixed(0)}</span>
                    <span>Suggested: ${opp.suggested_price.toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-white/40">{opp.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Service Suggestions */}
        {intelligence.insights?.new_service_suggestions?.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Suggested services</p>
            <div className="space-y-4">
              {intelligence.insights.new_service_suggestions.map((suggestion, i) => (
                <div key={i} className="border border-white/[0.08] p-6">
                  <p className="text-sm mb-2">{suggestion.service_name}</p>
                  <p className="text-xs text-white/40 mb-2">{suggestion.reasoning}</p>
                  <p className="text-xs text-white/30">Est demand: {suggestion.estimated_demand}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services to Review */}
        {intelligence.insights?.services_to_review?.length > 0 && (
          <div>
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Review needed</p>
            <div className="space-y-3">
              {intelligence.insights.services_to_review.map((review, i) => (
                <div key={i} className="border-b border-white/[0.05] pb-3">
                  <p className="text-sm mb-1">{review.service}</p>
                  <p className="text-xs text-white/40 mb-1">{review.issue}</p>
                  <p className="text-xs text-white/30">{review.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}