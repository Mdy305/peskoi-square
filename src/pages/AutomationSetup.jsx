import React from "react";

export default function AutomationSetup() {
  const functionUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/functions/dailyRetentionScheduler`
    : '[YOUR_DOMAIN]/api/functions/dailyRetentionScheduler';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Retention automation setup</p>

        <div className="space-y-12 text-sm text-white/60 leading-relaxed">

          <section>
            <p className="text-white/80 mb-4">Overview</p>
            <p>Automate daily execution of retention campaigns and outcome tracking without manual intervention.</p>
          </section>

          <section>
            <p className="text-white/80 mb-4">What gets automated</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Sending approved campaigns (status: scheduled)</li>
              <li>Tracking campaign responses and outcomes</li>
              <li>Updating campaign success metrics</li>
              <li>Logging execution for audit trail</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-4">Setup via Cron-Job.org (Free)</p>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-white/70 mb-2">1. Visit cron-job.org</p>
                <p className="text-white/40 text-xs">Create free account</p>
              </div>
              <div>
                <p className="text-white/70 mb-2">2. Create new cron job</p>
                <div className="bg-white/[0.03] p-4 border-l-2 border-white/[0.08] mt-2">
                  <p className="text-xs text-white/40 mb-2">URL:</p>
                  <code className="text-white/80 text-xs break-all">{functionUrl}</code>
                </div>
              </div>
              <div>
                <p className="text-white/70 mb-2">3. Schedule</p>
                <p className="text-white/40 text-xs">Daily at 9:00 AM (your timezone)</p>
                <p className="text-white/40 text-xs mt-2">Cron expression: 0 9 * * *</p>
              </div>
              <div>
                <p className="text-white/70 mb-2">4. Method</p>
                <p className="text-white/40 text-xs">POST (recommended) or GET</p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-white/80 mb-4">Alternative: Vercel Cron (Paid)</p>
            <div className="space-y-2 text-xs text-white/40">
              <p>If using Vercel Pro/Enterprise:</p>
              <p>Add to vercel.json:</p>
              <pre className="bg-white/[0.03] p-4 border-l-2 border-white/[0.08] mt-2 text-white/80">
{`{
  "crons": [{
    "path": "/api/functions/dailyRetentionScheduler",
    "schedule": "0 9 * * *"
  }]
}`}
              </pre>
            </div>
          </section>

          <section>
            <p className="text-white/80 mb-4">Test automation now</p>
            <p className="text-white/40 text-xs mb-4">Run via terminal or Postman:</p>
            <pre className="bg-white/[0.03] p-4 border-l-2 border-white/[0.08] text-white/80 text-xs">
{`curl -X POST ${functionUrl}`}
            </pre>
            <p className="text-white/40 text-xs mt-4">Expected response: campaigns_sent, outcomes_tracked counts</p>
          </section>

          <section>
            <p className="text-white/80 mb-4">Monitoring</p>
            <p>Check execution status in Retention Engine page. Last run timestamp and metrics are displayed automatically.</p>
          </section>

          <section>
            <p className="text-white/80 mb-4">Safety</p>
            <ul className="list-disc ml-6 space-y-2 text-white/40">
              <li>Only sends campaigns you've approved</li>
              <li>Respects campaign scheduled dates</li>
              <li>Logs all executions for audit</li>
              <li>Fails gracefully if APIs are down</li>
              <li>No duplicate sends (campaigns transition to 'active' after sending)</li>
            </ul>
          </section>

        </div>

      </div>
    </div>
  );
}