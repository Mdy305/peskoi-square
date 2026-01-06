import React from "react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Pricing</p>

        {/* Commission Model */}
        <div className="mb-20">
          <h2 className="text-2xl font-light tracking-wide mb-8 text-white/90">Commission-Based Model</h2>
          <div className="border border-white/[0.08] p-8 sm:p-12">
            <div className="text-center mb-8">
              <p className="text-6xl font-light mb-4">1%</p>
              <p className="text-sm text-white/60">On every completed transaction</p>
            </div>
            <div className="space-y-4 text-sm text-white/60">
              <p>PESKOI takes 1% commission on bookings processed through the AI concierge widget.</p>
              <p>You only pay when you earn. No upfront costs. No hidden fees.</p>
              <div className="mt-8 pt-8 border-t border-white/[0.08]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/40">Customer pays</span>
                  <span className="text-white/80">$100</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/40">PESKOI commission (1%)</span>
                  <span className="text-white/60">$1</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.08]">
                  <span className="text-white/60">You receive</span>
                  <span className="text-white">$99</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div>
          <h2 className="text-2xl font-light tracking-wide mb-8 text-white/90">Subscription Tiers</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Starter */}
            <div className="border border-white/[0.08] p-8">
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-4">Starter</p>
              <p className="text-3xl font-light mb-6">$99<span className="text-sm text-white/40">/mo</span></p>
              <ul className="space-y-3 text-sm text-white/60">
                <li>AI booking assistant</li>
                <li>Square integration</li>
                <li>Basic analytics</li>
                <li>Appointment reminders</li>
                <li>1% commission on transactions</li>
              </ul>
            </div>

            {/* Professional */}
            <div className="border border-white/[0.08] p-8 bg-white/[0.02]">
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-4">Professional</p>
              <p className="text-3xl font-light mb-6">$199<span className="text-sm text-white/40">/mo</span></p>
              <ul className="space-y-3 text-sm text-white/60">
                <li>Everything in Starter</li>
                <li>Retention engine</li>
                <li>Advanced analytics</li>
                <li>Client segmentation</li>
                <li>Product recommendations</li>
                <li>1% commission on transactions</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="border border-white/[0.08] p-8">
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-4">Enterprise</p>
              <p className="text-3xl font-light mb-6">$499<span className="text-sm text-white/40">/mo</span></p>
              <ul className="space-y-3 text-sm text-white/60">
                <li>Everything in Professional</li>
                <li>White-label branding</li>
                <li>Priority support</li>
                <li>Custom integrations</li>
                <li>Dedicated account manager</li>
                <li>1% commission on transactions</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Fine Print */}
        <div className="mt-20 pt-8 border-t border-white/[0.08]">
          <p className="text-xs text-white/40 leading-relaxed">
            All plans include 1% commission on transactions processed through PESKOI. 
            Subscription fees are billed monthly. No refunds. 
            Square processing fees apply separately per Square's pricing policy.
          </p>
        </div>

      </div>
    </div>
  );
}