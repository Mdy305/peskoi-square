import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">Terms of Service</h1>
        <p className="text-xs text-white/40 mb-12">Last updated: December 25, 2025</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <p className="text-white/80 mb-2">1. Agreement to Terms</p>
            <p>By accessing PESKOI, you agree to these Terms of Service and all applicable laws. If you do not agree, discontinue use immediately.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">2. Service Description</p>
            <p>PESKOI is a SaaS platform that provides AI-assisted booking, client management, and communication tools for appointment-based businesses. The service integrates with Square, Inc. for payment processing and appointment management.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">3. Disclaimer of Warranty</p>
            <p className="uppercase tracking-wide">SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. PESKOI DISCLAIMS ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">4. Limitation of Liability</p>
            <p className="uppercase tracking-wide">IN NO EVENT SHALL PESKOI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM USE OF THE SERVICE.</p>
            <p className="mt-4">This includes but is not limited to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Lost revenue or profits</li>
              <li>Service disruptions or downtime</li>
              <li>Data loss or corruption</li>
              <li>Third-party API failures (including Square)</li>
              <li>AI-generated errors or inaccuracies</li>
              <li>Customer disputes or chargebacks</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">5. AI as Decision Support Only</p>
            <p>AI features are assistive tools that require human review and approval. You remain solely responsible for all business decisions, communications, and actions taken through the platform.</p>
            <p className="mt-4">PESKOI is not liable for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>AI-generated message content</li>
              <li>Booking predictions or recommendations</li>
              <li>Client segmentation or churn analysis</li>
              <li>Automated campaign suggestions</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">6. Square Integration Terms</p>
            <p>PESKOI uses Square's public APIs. All payments, refunds, and disputes are handled exclusively by Square. You must comply with Square's Terms of Service.</p>
            <p className="mt-4">PESKOI is not responsible for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Square API downtime or rate limits</li>
              <li>Payment processing issues</li>
              <li>Square account suspensions</li>
              <li>Data sync delays between Square and PESKOI</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">7. Seller Responsibilities</p>
            <p>You are responsible for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Compliance with all applicable laws (TCPA, CAN-SPAM, GDPR, etc.)</li>
              <li>Obtaining customer consent for communications</li>
              <li>Accuracy of service descriptions and pricing</li>
              <li>Timely delivery of booked services</li>
              <li>Customer service and dispute resolution</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">8. Prohibited Uses</p>
            <p>You may not use PESKOI to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Send spam or unsolicited communications</li>
              <li>Discriminate based on protected characteristics</li>
              <li>Engage in deceptive marketing practices</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Abuse or circumvent Square's payment systems</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">9. Account Suspension</p>
            <p>PESKOI reserves the right to suspend or terminate accounts for violations of these Terms, illegal activity, or abuse of the platform.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">10. No Refunds</p>
            <p>All subscription fees are non-refundable. Cancellations take effect at the end of the current billing period.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">11. Indemnification</p>
            <p>You agree to indemnify and hold PESKOI harmless from any claims, damages, or expenses arising from your use of the service, including violations of marketing laws or customer disputes.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">12. Arbitration & Class-Action Waiver</p>
            <p className="uppercase tracking-wide">ANY DISPUTE SHALL BE RESOLVED BY BINDING ARBITRATION. YOU WAIVE THE RIGHT TO PARTICIPATE IN CLASS-ACTION LAWSUITS.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">13. Governing Law</p>
            <p>These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">14. Changes to Terms</p>
            <p>PESKOI may update these Terms at any time. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">15. Force Majeure</p>
            <p>PESKOI is not liable for failures caused by events beyond our control, including but not limited to natural disasters, internet outages, third-party API failures, or government actions.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">16. Severability</p>
            <p>If any provision is found unenforceable, remaining provisions remain in full effect.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">17. Contact</p>
            <p>For questions about these Terms:</p>
            <p className="mt-2">Email: legal@peskoi.com</p>
          </section>

        </div>

      </div>
    </div>
  );
}