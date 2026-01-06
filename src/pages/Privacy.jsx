import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">Privacy Policy</h1>
        <p className="text-xs text-white/40 mb-12">Last updated: December 25, 2025</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <p className="text-white/80 mb-2">1. Information We Collect</p>
            <p>We collect information necessary to provide PESKOI services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Account information (email, business name)</li>
              <li>Square OAuth tokens (encrypted)</li>
              <li>Customer data synced from Square (names, emails, phone numbers)</li>
              <li>Appointment and booking data</li>
              <li>Communication logs (SMS, email)</li>
              <li>Usage analytics and performance metrics</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">2. How We Use Your Information</p>
            <p>Data is used solely to provide and improve PESKOI services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Sync appointments and customer data from Square</li>
              <li>Send booking confirmations, reminders, and follow-ups</li>
              <li>Generate AI-assisted recommendations (requires human approval)</li>
              <li>Analyze retention and engagement metrics</li>
              <li>Improve service quality and features</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">3. Third-Party Processors</p>
            <p>PESKOI integrates with third-party services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Square:</strong> Payment processing, appointment management, customer data</li>
              <li><strong>OpenAI:</strong> AI-powered features (message generation, analysis)</li>
              <li><strong>Twilio:</strong> SMS and voice call services (optional)</li>
              <li><strong>Base44:</strong> Infrastructure and data storage</li>
            </ul>
            <p className="mt-4">Each processor has its own privacy policy. PESKOI is not responsible for third-party data practices.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">4. Data Retention</p>
            <p>We retain data as long as your account is active or as needed to provide services. You may request data deletion at any time by contacting support@peskoi.com.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">5. Your Rights</p>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Access your data</li>
              <li>Request data correction</li>
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Opt out of AI features</li>
              <li>Revoke Square integration access</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">6. GDPR & CCPA Compliance</p>
            <p>For EU and California residents, we comply with GDPR and CCPA requirements. Contact privacy@peskoi.com to exercise your rights.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">7. Data Security</p>
            <p>We use industry-standard encryption and security practices:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Square tokens encrypted at rest</li>
              <li>HTTPS/TLS for all data transmission</li>
              <li>Role-based access controls</li>
              <li>Regular security audits</li>
            </ul>
            <p className="mt-4">However, no system is 100% secure. You use PESKOI at your own risk.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">8. Children's Privacy</p>
            <p>PESKOI is not intended for users under 18. We do not knowingly collect data from children.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">9. International Data Transfers</p>
            <p>Data may be processed in the United States or other jurisdictions where our service providers operate. By using PESKOI, you consent to international data transfers.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">10. Changes to Privacy Policy</p>
            <p>We may update this policy at any time. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">11. Data Breach Notification</p>
            <p>In the event of a data breach affecting your information, we will notify you within 72 hours via email.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">12. Contact</p>
            <p>For privacy questions or data requests:</p>
            <p className="mt-2">Email: privacy@peskoi.com</p>
            <p>Data Protection Officer: dpo@peskoi.com</p>
          </section>

        </div>

      </div>
    </div>
  );
}