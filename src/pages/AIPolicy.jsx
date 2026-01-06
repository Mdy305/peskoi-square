import React from "react";

export default function AIPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <h1 className="text-2xl font-light tracking-[0.2em] mb-4">AI Usage Policy</h1>
        <p className="text-xs text-white/40 mb-12">Last updated: December 25, 2025</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <p className="text-white/80 mb-2">1. AI-Powered Features</p>
            <p>PESKOI uses AI (powered by OpenAI GPT-4) for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Client communication suggestions (SMS, email)</li>
              <li>Churn risk analysis and retention recommendations</li>
              <li>Product and service upsell recommendations</li>
              <li>Booking assistance via chat widget</li>
              <li>Business intelligence insights</li>
              <li>Automated message drafting for campaigns</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">2. AI as Decision Support, Not Decision-Maker</p>
            <p className="uppercase tracking-wide">ALL AI OUTPUTS REQUIRE HUMAN REVIEW AND APPROVAL BEFORE ACTION.</p>
            <p className="mt-4">AI does not:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Send communications autonomously</li>
              <li>Process payments or refunds</li>
              <li>Modify pricing or availability</li>
              <li>Make binding commitments on your behalf</li>
            </ul>
            <p className="mt-4">You remain legally responsible for all actions taken through PESKOI, including AI-assisted actions you approve.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">3. AI Limitations & Known Issues</p>
            <p>AI systems have inherent limitations:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Hallucinations:</strong> AI may generate plausible but false information</li>
              <li><strong>Bias:</strong> AI may reflect biases in training data</li>
              <li><strong>Context Misunderstanding:</strong> AI may misinterpret nuanced situations</li>
              <li><strong>Inconsistency:</strong> Similar inputs may produce different outputs</li>
              <li><strong>Outdated Information:</strong> AI training data has a cutoff date</li>
            </ul>
            <p className="mt-4 uppercase tracking-wide">PESKOI IS NOT LIABLE FOR AI ERRORS, INACCURACIES, OR INAPPROPRIATE OUTPUTS.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">4. Human Oversight Requirements</p>
            <p>You must:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Review all AI-generated messages before sending</li>
              <li>Verify AI churn risk assessments against your knowledge</li>
              <li>Edit AI suggestions to match your brand voice</li>
              <li>Monitor AI performance and disable features if unreliable</li>
              <li>Maintain final decision-making authority</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">5. AI Training & Data Usage</p>
            <p>Your data is NOT used to train public AI models. However:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>AI interactions are logged for debugging and compliance</li>
              <li>Anonymized, aggregated data may be used to improve PESKOI</li>
              <li>OpenAI processes prompts according to their Data Usage Policy</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">6. Compliance with Marketing Laws</p>
            <p>AI-generated communications must comply with:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>TCPA (Telephone Consumer Protection Act)</li>
              <li>CAN-SPAM Act</li>
              <li>GDPR (for EU customers)</li>
              <li>CASL (Canada's Anti-Spam Legislation)</li>
            </ul>
            <p className="mt-4 uppercase tracking-wide">YOU ARE RESPONSIBLE FOR LEGAL COMPLIANCE. PESKOI IS NOT RESPONSIBLE FOR VIOLATIONS OF MARKETING LAWS.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">7. AI Liability Disclaimer</p>
            <p>PESKOI is not liable for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Negative customer reactions to AI-generated messages</li>
              <li>Lost revenue from AI recommendations</li>
              <li>Incorrect churn predictions</li>
              <li>AI hallucinations or factual errors</li>
              <li>Legal violations resulting from AI-generated content</li>
            </ul>
          </section>

          <section>
            <p className="text-white/80 mb-2">8. Right to Request Human Review</p>
            <p>You may request human review of AI decisions at any time by contacting ai-review@peskoi.com. We will respond within 5 business days.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">9. AI Transparency</p>
            <p>PESKOI discloses AI usage within the application:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>AI-assisted features are marked clearly</li>
              <li>AI model provider (OpenAI) is disclosed</li>
            </ul>
            <p className="mt-4">End customers (your clients) are NOT explicitly notified that PESKOI uses AI unless you choose to disclose this.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">10. Ethical AI Use</p>
            <p>You agree NOT to use AI features for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Deceptive marketing practices</li>
              <li>Discriminatory targeting or messaging</li>
              <li>Harassment or spam</li>
              <li>Impersonation without disclosure</li>
            </ul>
            <p className="mt-4">Violations may result in account suspension.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">11. AI Model Changes</p>
            <p>PESKOI may upgrade AI models at any time to improve performance. Model changes may affect output quality. PESKOI is not liable for disruptions caused by model updates.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">12. Feedback & Improvement</p>
            <p>When you approve or reject AI suggestions, this feedback is logged (anonymized and aggregated) to improve future recommendations.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">13. AI Downtime</p>
            <p>AI features may be unavailable due to OpenAI outages. PESKOI manual features remain functional during AI downtime. No refunds are issued for AI feature outages.</p>
          </section>

          <section>
            <p className="text-white/80 mb-2">14. Contact</p>
            <p>For AI-related questions:</p>
            <p className="mt-2">General: ai@peskoi.com</p>
            <p>Report AI Errors: ai-errors@peskoi.com</p>
            <p>Opt Out of AI: ai-optout@peskoi.com</p>
          </section>

        </div>

      </div>
    </div>
  );
}