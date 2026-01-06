import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronRight, CheckCircle2, Circle } from "lucide-react";

export default function SaasOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    business_name: "",
    owner_email: "",
    owner_name: "",
    website_url: "",
    subscription_tier: "trial"
  });
  const [onboardingResult, setOnboardingResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [squareConnected, setSquareConnected] = useState(false);
  const [automationSettings, setAutomationSettings] = useState({
    reminder_enabled: true,
    reminder_hours_before: 24,
    feedback_enabled: true,
    communication_channel: "sms"
  });
  const [brandVoice, setBrandVoice] = useState({
    tone: "professional",
    custom_greeting: "",
    custom_instructions: ""
  });

  const onboardMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('saasClientOnboard', data),
    onSuccess: (res) => {
      setOnboardingResult(res.data);
      setStep(2);
    }
  });

  const squareConnectMutation = useMutation({
    mutationFn: (client_id) => base44.functions.invoke('saasSquareConnect', { client_id }),
    onSuccess: (res) => {
      window.location.href = res.data.auth_url;
    }
  });

  const saveAutomationMutation = useMutation({
    mutationFn: async (settings) => {
      const automationData = {
        saas_client_id: onboardingResult.client_id,
        ...settings
      };
      return base44.entities.ClientAutomationSettings.create(automationData);
    },
    onSuccess: () => {
      setStep(4);
    }
  });

  const saveBrandVoiceMutation = useMutation({
    mutationFn: async (voice) => {
      const greetingText = voice.custom_greeting || 
        `Welcome! I'm your AI assistant. How can I help you book an appointment today?`;
      const instructions = voice.custom_instructions || 
        `You are a ${voice.tone} AI concierge for ${formData.business_name}. Help customers book appointments naturally.`;
      
      return base44.entities.SaasClient.update(onboardingResult.client_id, {
        ai_greeting: greetingText,
        ai_instructions: instructions,
        brand_tone: voice.tone
      });
    },
    onSuccess: () => {
      setStep(5);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardMutation.mutate(formData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(onboardingResult.embed_script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { number: 1, title: "Business Info", completed: step > 1 },
    { number: 2, title: "Connect Square", completed: step > 2 },
    { number: 3, title: "Communication", completed: step > 3 },
    { number: 4, title: "Brand Voice", completed: step > 4 },
    { number: 5, title: "Complete", completed: step > 5 }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">
          Client Onboarding
        </p>

        {/* Progress Indicator */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center mb-2 transition-colors ${
                    s.completed 
                      ? "border-white/40 bg-white/10" 
                      : step === s.number 
                        ? "border-white" 
                        : "border-white/[0.08]"
                  }`}>
                    {s.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-white/60" />
                    ) : (
                      <span className="text-xs text-white/60">{s.number}</span>
                    )}
                  </div>
                  <span className={`text-[10px] text-center ${
                    step === s.number ? "text-white/80" : "text-white/40"
                  }`}>
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${
                    s.completed ? "bg-white/20" : "bg-white/[0.08]"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Business Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-light mb-8">Business Information</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Business Name</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Owner Email</label>
                  <input
                    type="email"
                    value={formData.owner_email}
                    onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Owner Name</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Website URL</label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="w-full bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Subscription Tier</label>
                  <select
                    value={formData.subscription_tier}
                    onChange={(e) => setFormData({ ...formData, subscription_tier: e.target.value })}
                    className="w-full bg-black border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  >
                    <option value="trial">Trial (14 days)</option>
                    <option value="starter">Starter ($99/mo)</option>
                    <option value="professional">Professional ($199/mo)</option>
                    <option value="enterprise">Enterprise ($499/mo)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={onboardMutation.isPending}
                  className="w-full border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-50"
                >
                  {onboardMutation.isPending ? 'Creating Account...' : 'Continue'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Connect Square */}
          {step === 2 && onboardingResult && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-light mb-2">Connect Square</h2>
                <p className="text-sm text-white/40">
                  Connect your Square account to sync services, availability, and bookings.
                </p>
              </div>

              <div className="bg-white/[0.03] p-6 border border-white/[0.08] space-y-3">
                <p className="text-xs text-white/60">What will be synced:</p>
                <ul className="space-y-2 text-xs text-white/40">
                  <li>✓ Services and pricing</li>
                  <li>✓ Team members and availability</li>
                  <li>✓ Customer data</li>
                  <li>✓ Booking calendar</li>
                </ul>
              </div>

              <button
                onClick={() => squareConnectMutation.mutate(onboardingResult.client_id)}
                disabled={squareConnectMutation.isPending}
                className="w-full border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-50"
              >
                {squareConnectMutation.isPending ? 'Connecting to Square...' : 'Connect Square Account'}
              </button>

              <button
                onClick={() => setStep(3)}
                className="w-full text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                Skip for now
              </button>
            </motion.div>
          )}

          {/* Step 3: Communication Setup */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-light mb-2">Communication Settings</h2>
                <p className="text-sm text-white/40">
                  Configure automated reminders and feedback requests.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white/80 mb-1">Appointment Reminders</p>
                    <p className="text-xs text-white/40">Send automatic reminders before appointments</p>
                  </div>
                  <button
                    onClick={() => setAutomationSettings({ 
                      ...automationSettings, 
                      reminder_enabled: !automationSettings.reminder_enabled 
                    })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      automationSettings.reminder_enabled ? 'bg-white/20' : 'bg-white/[0.08]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      automationSettings.reminder_enabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {automationSettings.reminder_enabled && (
                  <div className="space-y-1 ml-4">
                    <label className="text-xs text-white/40 block">Hours before appointment</label>
                    <input
                      type="number"
                      value={automationSettings.reminder_hours_before}
                      onChange={(e) => setAutomationSettings({ 
                        ...automationSettings, 
                        reminder_hours_before: parseInt(e.target.value) 
                      })}
                      className="w-24 bg-transparent border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white/80 mb-1">Post-Service Feedback</p>
                    <p className="text-xs text-white/40">Request feedback after completed appointments</p>
                  </div>
                  <button
                    onClick={() => setAutomationSettings({ 
                      ...automationSettings, 
                      feedback_enabled: !automationSettings.feedback_enabled 
                    })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      automationSettings.feedback_enabled ? 'bg-white/20' : 'bg-white/[0.08]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      automationSettings.feedback_enabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Communication Channel</label>
                  <select
                    value={automationSettings.communication_channel}
                    onChange={(e) => setAutomationSettings({ 
                      ...automationSettings, 
                      communication_channel: e.target.value 
                    })}
                    className="w-full bg-black border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  >
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="both">Both SMS & Email</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide"
                >
                  Back
                </button>
                <button
                  onClick={() => saveAutomationMutation.mutate(automationSettings)}
                  disabled={saveAutomationMutation.isPending}
                  className="flex-1 border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-50"
                >
                  {saveAutomationMutation.isPending ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Brand Voice */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-light mb-2">AI Concierge Brand Voice</h2>
                <p className="text-sm text-white/40">
                  Customize how your AI assistant communicates with customers.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Tone</label>
                  <select
                    value={brandVoice.tone}
                    onChange={(e) => setBrandVoice({ ...brandVoice, tone: e.target.value })}
                    className="w-full bg-black border-b border-white/[0.08] pb-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  >
                    <option value="professional">Professional & Polished</option>
                    <option value="friendly">Friendly & Warm</option>
                    <option value="luxury">Luxury & Exclusive</option>
                    <option value="casual">Casual & Relaxed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Custom Greeting (Optional)</label>
                  <textarea
                    value={brandVoice.custom_greeting}
                    onChange={(e) => setBrandVoice({ ...brandVoice, custom_greeting: e.target.value })}
                    placeholder="Welcome! How can I help you today?"
                    className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none focus:border-white/20 transition-colors min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/40 block">Custom Instructions (Optional)</label>
                  <textarea
                    value={brandVoice.custom_instructions}
                    onChange={(e) => setBrandVoice({ ...brandVoice, custom_instructions: e.target.value })}
                    placeholder="Additional guidelines for AI behavior..."
                    className="w-full bg-transparent border border-white/[0.08] p-3 text-sm focus:outline-none focus:border-white/20 transition-colors min-h-[100px] resize-none"
                  />
                  <p className="text-[10px] text-white/30 mt-2">
                    Example: "Always mention our signature aromatherapy add-on" or "Use first names only"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide"
                >
                  Back
                </button>
                <button
                  onClick={() => saveBrandVoiceMutation.mutate(brandVoice)}
                  disabled={saveBrandVoiceMutation.isPending}
                  className="flex-1 border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide disabled:opacity-50"
                >
                  {saveBrandVoiceMutation.isPending ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && onboardingResult && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-white/60" />
                <h2 className="text-xl font-light mb-2">Setup Complete</h2>
                <p className="text-sm text-white/40">
                  {formData.business_name} is ready to start using PESKOI.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/[0.03] p-6 border border-white/[0.08] space-y-4">
                  <div>
                    <p className="text-xs text-white/40 mb-2">Widget ID</p>
                    <p className="text-xs text-white/60 break-all">{onboardingResult.widget_client_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-2">Login Credentials</p>
                    <p className="text-xs text-white/60">{formData.owner_email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-white/30 tracking-[0.15em] uppercase">Widget Embed Code</p>
                  <p className="text-xs text-white/40">
                    Paste this before the closing &lt;/body&gt; tag on your website:
                  </p>
                  <div className="relative">
                    <pre className="bg-white/[0.03] p-4 border border-white/[0.08] text-[10px] overflow-x-auto">
                      {onboardingResult.embed_script}
                    </pre>
                    <button
                      onClick={handleCopy}
                      className="absolute top-2 right-2 p-2 hover:bg-white/10 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white/[0.03] p-6 border border-white/[0.08] space-y-3">
                  <p className="text-xs text-white/60">Next Steps:</p>
                  <ul className="space-y-2 text-xs text-white/40">
                    <li>1. Client will receive welcome email with login link</li>
                    <li>2. Configure services in Square dashboard</li>
                    <li>3. Test widget on their website</li>
                    <li>4. Monitor first bookings in PESKOI dashboard</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    business_name: "",
                    owner_email: "",
                    owner_name: "",
                    website_url: "",
                    subscription_tier: "trial"
                  });
                  setOnboardingResult(null);
                }}
                className="w-full border border-white/[0.08] px-6 py-3 hover:border-white/20 transition-colors text-sm tracking-wide"
              >
                Onboard Another Client
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}