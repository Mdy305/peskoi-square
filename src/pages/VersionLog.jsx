import React from "react";

export default function VersionLog() {
  const versions = [
    {
      version: "1.0.0",
      date: "December 26, 2025",
      type: "Major Release",
      changes: [
        "Initial production release",
        "Square Appointments integration",
        "AI-powered booking assistant",
        "Multi-client SaaS platform",
        "Retention engine with churn analysis",
        "Communication automation (SMS, Email)",
        "Voice call handling (Twilio)",
        "Reputation management suite",
        "Analytics and forecasting",
        "Agency dashboard",
        "Legal and compliance pages",
        "System status monitoring",
        "Feature inventory",
        "AI safety disclosures",
        "Marketplace readiness audit"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Version History</p>

        <div className="mb-16">
          <h1 className="text-2xl font-light mb-4">Change Log</h1>
          <p className="text-sm text-white/60">
            Complete version history and feature releases for PESKOI.
          </p>
        </div>

        {/* Version History */}
        <div className="space-y-12">
          {versions.map((release) => (
            <div key={release.version}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-light">v{release.version}</h2>
                <span className="text-xs text-white/40">{release.date}</span>
                <span className="text-xs px-3 py-1 bg-white/[0.08] border border-white/[0.08]">
                  {release.type}
                </span>
              </div>

              <div className="space-y-2">
                {release.changes.map((change, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-white/40 text-xs mt-1">•</span>
                    <p className="text-sm text-white/60">{change}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div className="mt-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Coming Soon</p>
          <div className="bg-white/[0.03] p-6 border border-white/[0.08] space-y-3">
            <p className="text-sm text-white/60">Future releases will focus on:</p>
            <ul className="space-y-2 text-xs text-white/40">
              <li>• Enhanced analytics and reporting</li>
              <li>• Additional marketplace integrations</li>
              <li>• Advanced AI personalization</li>
              <li>• Mobile applications (iOS, Android)</li>
              <li>• API for third-party developers</li>
              <li>• Enterprise SSO and advanced security</li>
            </ul>
          </div>
        </div>

        {/* Release Notes */}
        <div className="mt-12 bg-white/[0.03] p-6 border border-white/[0.08]">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Release Notes</p>
          <p className="text-sm text-white/60 mb-4">
            Stay updated on new features and improvements:
          </p>
          <a 
            href="mailto:updates@peskoi.com?subject=Subscribe%20to%20Release%20Notes"
            className="text-xs text-white/60 hover:text-white transition-colors underline"
          >
            Subscribe to release notifications
          </a>
        </div>

      </div>
    </div>
  );
}