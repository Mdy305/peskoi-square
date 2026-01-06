import React from "react";

export default function DataPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">Data Retention & Deletion</h1>
        <p className="text-xs text-white/40 mb-12">Last updated: December 26, 2025</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <p className="text-white/80 mb-2">1. Data We Store</p>
            <p>PESKOI stores the following data:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Business account information (name, email, phone)</li>
              <li>Customer data synced from Square (names, contact info, appointment history)</li>
              <li>Appointment and booking records</li>
              <li>Communication logs (SMS, email, chat transcripts)</li>
              <li>AI interaction logs (for debugging and compliance)</li>
              <li>Payment metadata (NOT card numbers or sensitive payment data)</li>
              <li>Analytics and usage data</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">2. Retention Periods</p>
            <div className="space-y-3">
              <div>
                <p className="text-white/70">Active Accounts</p>
                <p className="text-white/40 text-xs mt-1">All data retained for operational purposes while account is active</p>
              </div>
              <div>
                <p className="text-white/70">Inactive Accounts (30+ days)</p>
                <p className="text-white/40 text-xs mt-1">Full data retained, available for reactivation</p>
              </div>
              <div>
                <p className="text-white/70">Canceled Accounts</p>
                <p className="text-white/40 text-xs mt-1">Data retained for 90 days, then archived</p>
              </div>
              <div>
                <p className="text-white/70">Archived Data</p>
                <p className="text-white/40 text-xs mt-1">Anonymized aggregates retained for 7 years (legal compliance)</p>
              </div>
              <div>
                <p className="text-white/70">Communication Logs</p>
                <p className="text-white/40 text-xs mt-1">Retained for 3 years (TCPA compliance)</p>
              </div>
              <div>
                <p className="text-white/70">AI Logs</p>
                <p className="text-white/40 text-xs mt-1">Retained for 1 year (debugging and safety audits)</p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-white/80 mb-2">3. Data Deletion Rights</p>
            <p>You have the right to request deletion of your data at any time. Deletion requests are processed as follows:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Personal account data: Deleted within 30 days</li>
              <li>Customer data: Deleted within 30 days</li>
              <li>Communication logs: Retained for 90 days (legal requirement), then deleted</li>
              <li>Analytics: Anonymized immediately, aggregates retained</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">4. How to Request Deletion</p>
            <p>To request data deletion:</p>
            <ol className="list-decimal ml-6 mt-2 space-y-1">
              <li>Email: privacy@peskoi.com</li>
              <li>Subject: "Data Deletion Request"</li>
              <li>Include: Account email and business name</li>
              <li>We will confirm receipt within 48 hours</li>
              <li>Deletion completed within 30 days</li>
              <li>You will receive confirmation email when complete</li>
            </ol>
          </section>

          <section>
            <p className="text-white/80 mb-2">5. Data We Cannot Delete</p>
            <p>The following data must be retained for legal and regulatory compliance:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Tax records (7 years)</li>
              <li>Payment records for completed transactions (7 years)</li>
              <li>TCPA-related communication logs (3 years)</li>
              <li>Dispute and chargeback records (7 years)</li>
              <li>Legal hold data (until hold is lifted)</li>
            </ul>
            <p className="mt-4">This data is anonymized where possible and stored securely with restricted access.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">6. Square Data</p>
            <p>Data synced from Square is subject to Square's retention policies. PESKOI deletion does NOT delete data from Square. You must separately request deletion from Square if desired.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">7. Backup Data</p>
            <p>PESKOI maintains encrypted backups for disaster recovery. Deleted data is removed from backups within 90 days of deletion request completion.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">8. GDPR & CCPA Rights</p>
            <p>If you are in the EU or California, you have additional rights:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Right to access your data</li>
              <li>Right to data portability (export your data)</li>
              <li>Right to rectification (correct errors)</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to object to automated decision-making</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact: privacy@peskoi.com</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">9. Children's Data</p>
            <p className="uppercase tracking-wide">PESKOI DOES NOT KNOWINGLY COLLECT DATA FROM CHILDREN UNDER 13.</p>
            <p className="mt-4">If we discover we have collected data from a child under 13, we will delete it immediately. If you believe a child has provided data, contact: privacy@peskoi.com</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">10. Data Breach Notification</p>
            <p>In the event of a data breach, PESKOI will:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Notify affected users within 72 hours</li>
              <li>Provide details of breach scope and impact</li>
              <li>Explain remediation steps taken</li>
              <li>Offer guidance on protective measures</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">11. Contact for Data Inquiries</p>
            <p>For all data-related questions:</p>
            <p className="mt-2">Email: privacy@peskoi.com</p>
            <p>Response time: Within 5 business days</p>
          </section>

        </div>

      </div>
    </div>
  );
}