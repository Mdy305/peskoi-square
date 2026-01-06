import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function AdvancedAnalytics() {
  const [activeSection, setActiveSection] = useState("churn");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["advancedAnalytics"],
    queryFn: async () => {
      const response = await base44.functions.invoke("generateAdvancedAnalytics", {});
      return response.data;
    },
  });

  const analytics = analyticsData?.analytics || {};
  const rawData = analyticsData?.raw_data || {};

  const sections = [
    { id: "churn", label: "Churn Prediction" },
    { id: "retention", label: "Retention Campaigns" },
    { id: "services", label: "Service Trends" },
    { id: "stylists", label: "Stylist Performance" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16">
          <div className="text-xs tracking-[0.3em] text-white/30 mb-4">
            ADVANCED ANALYTICS
          </div>
          <h1 className="text-2xl font-light tracking-wider">
            Intelligence Report
          </h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="text-white/30 text-sm tracking-wide">
              Analyzing data
            </div>
          </div>
        )}

        {/* Navigation */}
        {!isLoading && (
          <>
            <div className="flex gap-8 mb-12 border-b border-white/[0.08] pb-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-sm tracking-wide transition-colors duration-300 ${
                    activeSection === section.id
                      ? "text-white"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <AnimatePresence mode="wait">
              {/* Churn Prediction */}
              {activeSection === "churn" && (
                <motion.div
                  key="churn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-12"
                >
                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      PRIMARY FINDING
                    </div>
                    <div className="text-white text-lg tracking-wide leading-relaxed">
                      {analytics.churn_insights?.primary_finding || "No data"}
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      RISK PATTERN
                    </div>
                    <div className="text-white text-base tracking-wide leading-relaxed">
                      {analytics.churn_insights?.risk_pattern || "No data"}
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      RECOMMENDATION
                    </div>
                    <div className="text-white text-base tracking-wide leading-relaxed">
                      {analytics.churn_insights?.recommendation || "No data"}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-white/40 text-xs tracking-wider mb-2">
                        TOTAL CLIENTS
                      </div>
                      <div className="text-white text-2xl font-light">
                        {rawData.total_clients || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs tracking-wider mb-2">
                        AT RISK
                      </div>
                      <div className="text-white text-2xl font-light">
                        {rawData.at_risk_count || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs tracking-wider mb-2">
                        RISK RATE
                      </div>
                      <div className="text-white text-2xl font-light">
                        {rawData.total_clients > 0
                          ? Math.round((rawData.at_risk_count / rawData.total_clients) * 100)
                          : 0}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Retention Campaigns */}
              {activeSection === "retention" && (
                <motion.div
                  key="retention"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-12"
                >
                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      SUCCESS RATE
                    </div>
                    <div className="text-white text-3xl font-light tracking-wide">
                      {analytics.retention_effectiveness?.success_rate || "0%"}
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      MOST EFFECTIVE STRATEGY
                    </div>
                    <div className="text-white text-lg tracking-wide">
                      {analytics.retention_effectiveness?.most_effective_strategy || "None"}
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      KEY INSIGHT
                    </div>
                    <div className="text-white text-base tracking-wide leading-relaxed">
                      {analytics.retention_effectiveness?.key_insight || "No data"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-white/40 text-xs tracking-wider mb-2">
                        CAMPAIGNS TRIGGERED
                      </div>
                      <div className="text-white text-2xl font-light">
                        {rawData.campaigns_triggered || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs tracking-wider mb-2">
                        TOTAL APPOINTMENTS
                      </div>
                      <div className="text-white text-2xl font-light">
                        {rawData.total_appointments || 0}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Service Trends */}
              {activeSection === "services" && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="border-b border-white/[0.08] pb-8">
                      <div className="text-white/40 text-xs tracking-wider mb-3">
                        RISING
                      </div>
                      <div className="text-white text-lg tracking-wide">
                        {analytics.service_trends?.rising || "None"}
                      </div>
                    </div>

                    <div className="border-b border-white/[0.08] pb-8">
                      <div className="text-white/40 text-xs tracking-wider mb-3">
                        DECLINING
                      </div>
                      <div className="text-white text-lg tracking-wide">
                        {analytics.service_trends?.declining || "None"}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      FORECAST
                    </div>
                    <div className="text-white text-base tracking-wide leading-relaxed">
                      {analytics.service_trends?.forecast || "No data"}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stylist Performance */}
              {activeSection === "stylists" && (
                <motion.div
                  key="stylists"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-12"
                >
                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      TOP PERFORMER
                    </div>
                    <div className="text-white text-lg tracking-wide">
                      {analytics.stylist_analysis?.top_performer || "None"}
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      TREND
                    </div>
                    <div className="text-white text-base tracking-wide">
                      {analytics.stylist_analysis?.trend || "No data"}
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] pb-8">
                    <div className="text-white/40 text-xs tracking-wider mb-3">
                      INSIGHT
                    </div>
                    <div className="text-white text-base tracking-wide leading-relaxed">
                      {analytics.stylist_analysis?.insight || "No data"}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Exit hint */}
        <div className="fixed bottom-8 left-0 right-0">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-white/20 text-xs tracking-widest text-center">
              Press ESC to exit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}