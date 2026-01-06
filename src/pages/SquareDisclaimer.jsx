import React from "react";

export default function SquareDisclaimer() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">Square Integration Disclaimer</h1>
        <p className="text-xs text-white/40 mb-12">Last updated: December 25, 2025</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <p className="text-white/80 mb-2">1. Independent Application</p>
            <p className="uppercase tracking-wide">PESKOI IS NOT OWNED, OPERATED, ENDORSED, OR AFFILIATED WITH SQUARE, INC.</p>
            <p className="mt-4">PESKOI is an independent third-party application that integrates with Square's public APIs. Any reference to "Square" is solely for compatibility indication and does not imply partnership or endorsement.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">2. Square's Role</p>
            <p>Square, Inc. provides:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Payment processing infrastructure</li>
              <li>Booking and appointment management APIs</li>
              <li>Customer data storage and management</li>
              <li>Catalog (services and products) management</li>
            </ul>
            <p className="mt-4">PESKOI uses Square's public APIs to access this data, subject to Square's Terms of Service.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">3. Payment Processing</p>
            <p className="uppercase tracking-wide">ALL CUSTOMER PAYMENTS ARE PROCESSED EXCLUSIVELY BY SQUARE. PESKOI DOES NOT PROCESS, STORE, OR MANAGE PAYMENT CARD DATA.</p>
            <p className="mt-4">PESKOI cannot:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Issue refunds (must be done through Square)</li>
              <li>Resolve payment disputes or chargebacks (handled by Square)</li>
              <li>Access full card numbers or CVV codes</li>
              <li>Modify payment amounts without creating new Square orders</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">4. API Reliability</p>
            <p>PESKOI's functionality depends on Square's API availability and performance. PESKOI is not responsible for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Square API downtime or outages</li>
              <li>Square rate limits or throttling</li>
              <li>Data sync delays between Square and PESKOI</li>
              <li>Changes to Square's API that break PESKOI functionality</li>
            </ul>
            <p className="mt-4 uppercase tracking-wide">SQUARE IS THE SINGLE SOURCE OF TRUTH FOR ALL APPOINTMENT, CUSTOMER, AND PAYMENT DATA.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">5. Booking Conflicts</p>
            <p>PESKOI checks LIVE Square availability before confirming bookings. However, race conditions may occur if multiple bookings happen simultaneously.</p>
            <p className="mt-4">In case of conflicts:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Square's booking system is authoritative</li>
              <li>You must resolve conflicts manually through Square</li>
              <li>PESKOI is not liable for double-bookings or scheduling errors</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">6. Square Terms of Service</p>
            <p>By using PESKOI, you agree to comply with Square's Terms of Service, including:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Acceptable use policies</li>
              <li>Prohibited businesses and activities</li>
              <li>Payment processing rules</li>
              <li>Data security requirements</li>
            </ul>
            <p className="mt-4">Violations of Square's ToS may result in suspension of your Square account, which will disable PESKOI integration.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">7. OAuth Token Security</p>
            <p>PESKOI stores encrypted Square OAuth tokens to access your data. You can revoke PESKOI's access at any time through your Square dashboard.</p>
            <p className="mt-4">Revoking access will:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Immediately disable PESKOI integration</li>
              <li>Prevent new bookings through PESKOI</li>
              <li>Stop data sync between Square and PESKOI</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">8. Refunds & Chargebacks</p>
            <p className="uppercase tracking-wide">ALL REFUND REQUESTS MUST BE PROCESSED THROUGH SQUARE. PESKOI CANNOT ISSUE REFUNDS.</p>
            <p className="mt-4">Chargeback disputes are handled by Square. Contact Square support for payment disputes.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">9. Revenue Guarantees</p>
            <p>PESKOI does not guarantee revenue increases, booking rates, or customer retention. Results depend on your business, services, and market conditions.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">10. Square Fees</p>
            <p>Square charges transaction fees per their pricing policy. PESKOI does not control or influence Square's fees. You are responsible for all Square processing costs.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">11. Account Suspension</p>
            <p>If your Square account is suspended or terminated, PESKOI integration will cease to function. PESKOI cannot restore Square account access.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">12. API Updates</p>
            <p>Square may update or deprecate APIs at any time. PESKOI will make reasonable efforts to adapt, but cannot guarantee uninterrupted service during Square API transitions.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">13. Data Accuracy</p>
            <p>PESKOI displays data as provided by Square's APIs. If data appears incorrect, verify directly in your Square dashboard. Square is the authoritative source.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">14. Customer Support</p>
            <p>For Square-specific issues:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Payment disputes: Contact Square support</li>
              <li>Account suspensions: Contact Square support</li>
              <li>API errors: Check Square status page first, then contact PESKOI if issue persists</li>
              <li>Data discrepancies: Verify in Square dashboard first</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">15. Trademark Notice</p>
            <p>"Square" and related marks are trademarks of Square, Inc. PESKOI's use of these marks is solely for integration purposes and does not imply endorsement.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">16. Contact</p>
            <p>For integration questions:</p>
            <p className="mt-2">PESKOI Support: support@peskoi.com</p>
            <p>Square Billing: Square dashboard or help.squareup.com</p>
          </section>

        </div>

      </div>
    </div>
  );
}