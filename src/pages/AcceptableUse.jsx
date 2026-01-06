import React from "react";

export default function AcceptableUse() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">Acceptable Use Policy</h1>
        <p className="text-xs text-white/40 mb-12">Last updated: December 25, 2025</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <p className="text-white/80 mb-2">1. Purpose</p>
            <p>This Acceptable Use Policy governs your use of PESKOI. Violations may result in account suspension or termination without refund.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">2. Prohibited Activities</p>
            <p>You may NOT use PESKOI to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Send spam or unsolicited commercial messages</li>
              <li>Violate TCPA, CAN-SPAM, GDPR, CASL, or other marketing laws</li>
              <li>Harass, threaten, or abuse customers or staff</li>
              <li>Engage in fraudulent or deceptive practices</li>
              <li>Discriminate based on race, gender, religion, or other protected characteristics</li>
              <li>Impersonate others or misrepresent your business</li>
              <li>Scrape or reverse-engineer PESKOI services</li>
              <li>Circumvent payment systems or fees</li>
              <li>Abuse Square's APIs or violate Square's Terms of Service</li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Infringe intellectual property rights</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">3. Account Sharing</p>
            <p>Your PESKOI account is for your business use only. Sharing login credentials or reselling PESKOI access is prohibited.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">4. Data Misuse</p>
            <p>You may NOT:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Export customer data for non-business purposes</li>
              <li>Sell or share customer data with third parties</li>
              <li>Use customer data after they opt out of communications</li>
              <li>Manipulate or falsify data to game analytics or reports</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">5. AI Misuse</p>
            <p>You may NOT:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Approve AI-generated messages that violate laws or regulations</li>
              <li>Use AI to generate deceptive or misleading content</li>
              <li>Rely solely on AI without human oversight</li>
              <li>Blame PESKOI for AI errors you approved</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">6. Rate Limits & Abuse</p>
            <p>PESKOI enforces rate limits to prevent abuse. Excessive API usage, bulk message campaigns, or attempts to overwhelm the system may result in throttling or suspension.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">7. Content Standards</p>
            <p>All communications sent through PESKOI must:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Be truthful and not misleading</li>
              <li>Comply with advertising standards</li>
              <li>Respect customer consent preferences</li>
              <li>Include opt-out mechanisms where required by law</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">8. Monitoring & Enforcement</p>
            <p>PESKOI reserves the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Monitor usage for policy violations</li>
              <li>Review reported complaints</li>
              <li>Suspend accounts pending investigation</li>
              <li>Terminate accounts for repeated violations</li>
              <li>Cooperate with law enforcement</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">9. Consequences of Violation</p>
            <p>Violations may result in:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Warning and request for corrective action</li>
              <li>Temporary suspension of services</li>
              <li>Permanent account termination without refund</li>
              <li>Referral to law enforcement if illegal activity is detected</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">10. Appeals</p>
            <p>If your account is suspended, you may appeal by contacting appeals@peskoi.com within 14 days. Include:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Account details</li>
              <li>Explanation of circumstances</li>
              <li>Corrective actions taken</li>
            </ul>
            <p className="mt-4">PESKOI's decision on appeals is final.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">11. Reporting Abuse</p>
            <p>To report abuse or policy violations:</p>
            <p className="mt-2">Email: abuse@peskoi.com</p>
            <p className="mt-2">Include screenshots, message IDs, or other evidence.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">12. Updates to Policy</p>
            <p>PESKOI may update this policy at any time. Continued use after updates constitutes acceptance.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">13. Contact</p>
            <p>For questions about acceptable use:</p>
            <p className="mt-2">Email: policy@peskoi.com</p>
          </section>

        </div>

      </div>
    </div>
  );
}