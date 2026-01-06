import React from "react";
import { Shield, AlertTriangle, CheckCircle2, Users } from "lucide-react";

export default function AISafety() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-white/60" />
          <h1 className="text-2xl font-light tracking-[0.2em]">AI Safety Statement</h1>
        </div>
        <p className="text-xs text-white/40 mb-12">Last updated: December 26, 2025</p>

        <div className="space-y-12 text-sm text-white/60 leading-relaxed">

          {/* Critical Notice */}
          <div className="bg-red-500/10 border border-red-500/20 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium mb-2">CRITICAL: AI is NOT Autonomous</p>
                <p className="text-white/60 text-sm">
                  PESKOI AI does NOT make decisions, execute payments, finalize bookings, or send communications 
                  without explicit human approval. All AI outputs are suggestions only.
                </p>
              </div>
            </div>
          </div>

          {/* What AI Does */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-white/80">What AI Does</p>
            </div>
            <ul className="space-y-2 ml-7">
              <li>• Suggests appointment times based on availability</li>
              <li>• Drafts customer messages (requires approval)</li>
              <li>• Analyzes churn risk and proposes retention strategies</li>
              <li>• Recommends products after services</li>
              <li>• Transcribes and summarizes phone calls</li>
              <li>• Detects sentiment in reviews</li>
              <li>• Generates analytics insights</li>
            </ul>
          </section>

          {/* What AI Does NOT Do */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <p className="text-white/80">What AI Does NOT Do</p>
            </div>
            <ul className="space-y-2 ml-7">
              <li>• Does NOT finalize bookings without confirmation</li>
              <li>• Does NOT process payments or refunds</li>
              <li>• Does NOT send messages without approval</li>
              <li>• Does NOT access or store credit card data</li>
              <li>• Does NOT make pricing decisions</li>
              <li>• Does NOT cancel appointments autonomously</li>
              <li>• Does NOT make legal or medical recommendations</li>
            </ul>
          </section>

          {/* Human Oversight */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-white/60" />
              <p className="text-white/80">Human Oversight Requirements</p>
            </div>
            <div className="space-y-3 ml-7">
              <p>Every AI action requires human review:</p>
              <div className="bg-white/[0.03] p-4 border border-white/[0.08] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Retention campaigns</span>
                  <span className="text-white/40">Manual approval required</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Booking confirmations</span>
                  <span className="text-white/40">User must click "Confirm"</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Product recommendations</span>
                  <span className="text-white/40">Merchant can edit/reject</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">SMS messages</span>
                  <span className="text-white/40">Review before send</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI Limitations */}
          <section>
            <p className="text-white/80 mb-4">Known AI Limitations</p>
            <div className="space-y-3">
              <div>
                <p className="text-white/70 text-sm">Hallucinations</p>
                <p className="text-white/40 text-xs">AI may generate plausible but incorrect information. Always verify.</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Context Misunderstanding</p>
                <p className="text-white/40 text-xs">AI may misinterpret nuanced customer requests.</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Inconsistency</p>
                <p className="text-white/40 text-xs">Similar inputs may produce different outputs.</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Bias</p>
                <p className="text-white/40 text-xs">AI reflects biases in training data. We monitor and mitigate this actively.</p>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <p className="text-white/80 mb-4">AI Training & Data</p>
            <ul className="space-y-2">
              <li>• Your data is NOT used to train public AI models</li>
              <li>• OpenAI processes prompts per their Data Usage Policy</li>
              <li>• AI interactions are logged for debugging and compliance only</li>
              <li>• Anonymized, aggregated insights may improve PESKOI</li>
            </ul>
          </section>

          {/* Safety Measures */}
          <section>
            <p className="text-white/80 mb-4">Safety Measures in Place</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                <div>
                  <p className="text-white/70 text-sm">Mandatory Human Approval</p>
                  <p className="text-white/40 text-xs">All customer-facing AI outputs require explicit confirmation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                <div>
                  <p className="text-white/70 text-sm">Action Logging</p>
                  <p className="text-white/40 text-xs">Every AI suggestion and human decision is logged for audit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                <div>
                  <p className="text-white/70 text-sm">Error Transparency</p>
                  <p className="text-white/40 text-xs">AI errors are surfaced immediately, not hidden</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                <div>
                  <p className="text-white/70 text-sm">Killswitch</p>
                  <p className="text-white/40 text-xs">Disable AI features instantly if performance degrades</p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Disclaimer */}
          <section className="bg-white/[0.03] p-6 border border-white/[0.08]">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-3">Legal Disclaimer</p>
            <p className="text-white/60 text-sm leading-relaxed">
              PESKOI is not liable for AI errors, inaccuracies, or inappropriate outputs. 
              You are legally responsible for all actions taken through PESKOI, including AI-assisted actions you approve. 
              AI is a tool, not a decision-maker. Final authority rests with you.
            </p>
          </section>

          {/* Reporting AI Issues */}
          <section>
            <p className="text-white/80 mb-4">Report AI Issues</p>
            <p className="mb-3">If you encounter problematic AI behavior:</p>
            <div className="bg-white/[0.03] p-4 border border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">AI Errors</span>
                <span className="text-white/40">ai-errors@peskoi.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Safety Concerns</span>
                <span className="text-white/40">safety@peskoi.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Bias Issues</span>
                <span className="text-white/40">ethics@peskoi.com</span>
              </div>
            </div>
            <p className="text-white/40 text-xs mt-3">We review all reports within 48 hours.</p>
          </section>

        </div>

      </div>
    </div>
  );
}