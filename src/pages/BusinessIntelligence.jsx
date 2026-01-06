import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function BusinessIntelligence() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["businessIntelligence"],
    queryFn: async () => {
      const response = await base44.functions.invoke("analyzeBusinessIntelligence", {});
      return response.data;
    },
    enabled: false,
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await refetch();
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Business Intelligence</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <p className="text-sm text-white/60 max-w-md leading-relaxed">
              Strategic insights from appointment data
            </p>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || isLoading}
              className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-30"
            >
              {isAnalyzing || isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!data && !isAnalyzing && !isLoading && (
          <div className="text-center py-20">
            <p className="text-sm text-white/40">Ready to analyze</p>
          </div>
        )}

        {/* Loading State */}
        {(isAnalyzing || isLoading) && (
          <div className="text-center py-20">
            <p className="text-sm text-white/40">Analyzing business data</p>
          </div>
        )}

        {/* Results */}
        {data && !isAnalyzing && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
            
            {/* Peak Times */}
            {data.analysis?.peakTimes && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Peak times</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="border border-white/[0.08] p-6">
                    <p className="text-xs text-white/40 mb-2">Most popular</p>
                    <p className="text-sm text-white/80">{data.analysis.peakTimes.mostPopular}</p>
                  </div>
                  <div className="border border-white/[0.08] p-6">
                    <p className="text-xs text-white/40 mb-2">Least popular</p>
                    <p className="text-sm text-white/80">{data.analysis.peakTimes.leastPopular}</p>
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] p-6">
                  <p className="text-xs text-white/60">{data.analysis.peakTimes.recommendation}</p>
                </div>
              </div>
            )}

            {/* Service Trends */}
            {data.analysis?.serviceTrends && data.analysis.serviceTrends.length > 0 && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Service trends</p>
                <div className="space-y-4">
                  {data.analysis.serviceTrends.map((trend, index) => (
                    <div key={index} className="border-b border-white/[0.05] pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-white/80">{trend.service}</p>
                        <span className="text-xs text-white/40">{trend.trend}</span>
                      </div>
                      <p className="text-xs text-white/40">{trend.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stylist Insights */}
            {data.analysis?.stylistInsights && data.analysis.stylistInsights.length > 0 && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Stylist performance</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.analysis.stylistInsights.map((insight, index) => (
                    <div key={index} className="border border-white/[0.08] p-6">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-sm text-white/80">{insight.stylist}</p>
                        <span className="text-xs text-white/40">{insight.performance}</span>
                      </div>
                      <div className="space-y-3 text-xs">
                        <div>
                          <p className="text-white/30 mb-1">Strength</p>
                          <p className="text-white/60">{insight.strength}</p>
                        </div>
                        <div>
                          <p className="text-white/30 mb-1">Recommendation</p>
                          <p className="text-white/60">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Revenue Gaps */}
            {data.analysis?.revenueGaps && data.analysis.revenueGaps.length > 0 && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Revenue opportunities</p>
                <div className="space-y-6">
                  {data.analysis.revenueGaps.map((gap, index) => (
                    <div key={index} className="border border-white/[0.08] p-6">
                      <p className="text-sm text-white/80 mb-2">{gap.gap}</p>
                      <p className="text-xs text-white/40 mb-4">{gap.opportunity}</p>
                      <div className="bg-white/[0.03] p-4">
                        <p className="text-xs text-white/60">{gap.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Recommendations */}
            {data.analysis?.strategicRecommendations && data.analysis.strategicRecommendations.length > 0 && (
              <div>
                <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Strategic recommendations</p>
                <div className="space-y-4">
                  {data.analysis.strategicRecommendations.map((rec, index) => (
                    <div key={index} className="border-b border-white/[0.05] pb-6">
                      <p className="text-xs text-white/30 mb-2">{rec.category}</p>
                      <p className="text-sm text-white/80 mb-2">{rec.recommendation}</p>
                      <p className="text-xs text-white/40">{rec.expectedImpact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}

      </div>
    </div>
  );
}