import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function FeatureInventory() {
  const [filter, setFilter] = useState("all");

  const features = [
    {
      category: "Booking & Scheduling",
      items: [
        { name: "AI-Powered Booking Assistant", status: "live", description: "Natural language booking via chat widget" },
        { name: "Square Appointments Sync", status: "live", description: "Real-time sync with Square Appointments" },
        { name: "Team Member Availability", status: "live", description: "Staff scheduling and availability management" },
        { name: "Calendar Management", status: "live", description: "Unified calendar view across all bookings" },
        { name: "Manual Booking", status: "live", description: "Admin-initiated appointment creation" },
        { name: "Booking Modifications", status: "live", description: "Reschedule and cancel appointments" }
      ]
    },
    {
      category: "Client Management",
      items: [
        { name: "Customer Profiles", status: "live", description: "Detailed client history and preferences" },
        { name: "Square Customer Sync", status: "live", description: "Automatic customer data synchronization" },
        { name: "Service History", status: "live", description: "Complete appointment and service records" },
        { name: "Client Notes", status: "live", description: "Internal notes and tags per customer" },
        { name: "Client Segmentation", status: "live", description: "Tag-based customer organization" }
      ]
    },
    {
      category: "Communication",
      items: [
        { name: "SMS Reminders", status: "live", description: "Automated appointment reminders via Twilio" },
        { name: "Email Notifications", status: "live", description: "Booking confirmations and updates" },
        { name: "Post-Service Feedback", status: "live", description: "Automated feedback requests" },
        { name: "AI Chat Widget", status: "live", description: "Embeddable chat interface for websites" },
        { name: "Voice Call Handling", status: "live", description: "AI-powered phone answering (Twilio)" }
      ]
    },
    {
      category: "Retention & Growth",
      items: [
        { name: "Churn Risk Analysis", status: "live", description: "AI-detected at-risk customers" },
        { name: "Retention Campaigns", status: "live", description: "Automated re-engagement messaging" },
        { name: "Product Recommendations", status: "live", description: "Post-service retail suggestions" },
        { name: "Birthday Campaigns", status: "live", description: "Automated birthday offers" },
        { name: "Proactive Outreach", status: "live", description: "AI-suggested follow-ups" }
      ]
    },
    {
      category: "Analytics & Intelligence",
      items: [
        { name: "Dashboard Overview", status: "live", description: "Key metrics and activity feed" },
        { name: "Service Intelligence", status: "live", description: "Service performance analytics" },
        { name: "Stylist Performance", status: "live", description: "Team member KPIs" },
        { name: "Retention Analytics", status: "live", description: "Cohort and LTV analysis" },
        { name: "Revenue Forecasting", status: "live", description: "Predictive revenue modeling" },
        { name: "Inventory Insights", status: "live", description: "Product velocity and reorder alerts" }
      ]
    },
    {
      category: "Reputation Management",
      items: [
        { name: "Review Monitoring", status: "live", description: "Multi-platform review tracking" },
        { name: "Review Request Automation", status: "live", description: "Smart timing for review asks" },
        { name: "Sentiment Analysis", status: "live", description: "AI-powered review sentiment" },
        { name: "Voice & Geo Ranking", status: "live", description: "Local search optimization tracking" },
        { name: "Citation Verification", status: "live", description: "NAP consistency monitoring" }
      ]
    },
    {
      category: "SaaS Platform",
      items: [
        { name: "Multi-Client Dashboard", status: "live", description: "Agency-level client management" },
        { name: "Client Onboarding Wizard", status: "live", description: "Guided setup for new clients" },
        { name: "Widget Embedding", status: "live", description: "White-label chat widget" },
        { name: "Client Automation Settings", status: "live", description: "Per-client communication preferences" },
        { name: "SaaS Analytics", status: "live", description: "Platform-wide performance metrics" }
      ]
    },
    {
      category: "Integrations",
      items: [
        { name: "Square OAuth", status: "live", description: "Secure Square account connection" },
        { name: "Square Appointments API", status: "live", description: "Full booking lifecycle management" },
        { name: "Square Catalog API", status: "live", description: "Services and products sync" },
        { name: "Square Customers API", status: "live", description: "Customer data sync" },
        { name: "Twilio SMS", status: "live", description: "Transactional messaging" },
        { name: "Twilio Voice", status: "live", description: "Inbound call handling" },
        { name: "OpenAI GPT-4", status: "live", description: "Natural language AI" }
      ]
    },
    {
      category: "Compliance & Safety",
      items: [
        { name: "Terms of Service", status: "live", description: "Legal terms and conditions" },
        { name: "Privacy Policy", status: "live", description: "Data handling disclosure" },
        { name: "AI Usage Policy", status: "live", description: "AI limitations and safeguards" },
        { name: "Acceptable Use Policy", status: "live", description: "Prohibited activities" },
        { name: "Square Disclaimer", status: "live", description: "Third-party integration disclosure" },
        { name: "Data Retention Policy", status: "live", description: "Storage and deletion procedures" },
        { name: "AI Human Oversight", status: "live", description: "Manual approval for AI actions" }
      ]
    }
  ];

  const filteredFeatures = filter === "all" 
    ? features 
    : features.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.status === filter)
      })).filter(cat => cat.items.length > 0);

  const totalFeatures = features.reduce((sum, cat) => sum + cat.items.length, 0);
  const liveFeatures = features.reduce((sum, cat) => 
    sum + cat.items.filter(item => item.status === "live").length, 0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Feature Inventory</p>

        {/* Summary */}
        <div className="mb-12 flex gap-8">
          <div>
            <p className="text-3xl font-light">{liveFeatures}</p>
            <p className="text-xs text-white/40 mt-1">Live Features</p>
          </div>
          <div>
            <p className="text-3xl font-light">{features.length}</p>
            <p className="text-xs text-white/40 mt-1">Categories</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs px-4 py-2 border transition-colors ${
              filter === "all" 
                ? "border-white/20 text-white" 
                : "border-white/[0.08] text-white/40 hover:text-white/60"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("live")}
            className={`text-xs px-4 py-2 border transition-colors ${
              filter === "live" 
                ? "border-white/20 text-white" 
                : "border-white/[0.08] text-white/40 hover:text-white/60"
            }`}
          >
            Live Only
          </button>
        </div>

        {/* Feature Categories */}
        <div className="space-y-12">
          {filteredFeatures.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-light mb-6 pb-2 border-b border-white/[0.08]">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div 
                    key={item.name}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1">
                      {item.status === "live" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">{item.name}</p>
                      <p className="text-xs text-white/40 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Notice */}
        <div className="mt-16 bg-white/[0.03] p-6 border border-white/[0.08]">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-3">Enterprise Features</p>
          <p className="text-sm text-white/60 leading-relaxed">
            PESKOI is designed for production use. All features listed are fully operational and tested. 
            For custom integrations or feature requests, contact: enterprise@peskoi.com
          </p>
        </div>

      </div>
    </div>
  );
}