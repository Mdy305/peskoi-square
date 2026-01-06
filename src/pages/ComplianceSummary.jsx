import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, FileText, CheckCircle2 } from "lucide-react";

export default function ComplianceSummary() {
  const complianceAreas = [
    {
      title: "Legal Policies",
      icon: FileText,
      items: [
        { name: "Terms of Service", page: "Terms", status: "complete" },
        { name: "Privacy Policy", page: "Privacy", status: "complete" },
        { name: "Acceptable Use Policy", page: "AcceptableUse", status: "complete" },
        { name: "Data Retention & Deletion", page: "DataPolicy", status: "complete" }
      ]
    },
    {
      title: "AI Safety & Ethics",
      icon: Shield,
      items: [
        { name: "AI Usage Policy", page: "AIPolicy", status: "complete" },
        { name: "AI Safety Statement", page: "AISafety", status: "complete" },
        { name: "Human Oversight Requirements", page: "AISafety", status: "enforced" },
        { name: "AI Limitations Disclosure", page: "AIPolicy", status: "complete" }
      ]
    },
    {
      title: "Third-Party Integrations",
      icon: Shield,
      items: [
        { name: "Square Integration Disclosure", page: "SquareDisclaimer", status: "complete" },
        { name: "OpenAI Data Usage", page: "AIPolicy", status: "disclosed" },
        { name: "Twilio Communication", page: "Privacy", status: "disclosed" },
        { name: "Third-Party Data Sharing", page: "Privacy", status: "disclosed" }
      ]
    },
    {
      title: "Marketing & Communication",
      icon: CheckCircle2,
      items: [
        { name: "TCPA Compliance", page: "Terms", status: "enforced" },
        { name: "CAN-SPAM Compliance", page: "Terms", status: "enforced" },
        { name: "GDPR Compliance", page: "Privacy", status: "enforced" },
        { name: "CASL Compliance", page: "Privacy", status: "enforced" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Compliance Summary</p>

        <div className="mb-16">
          <h1 className="text-2xl font-light mb-4">Regulatory Compliance Overview</h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-3xl">
            PESKOI is designed with enterprise-grade compliance. All policies, disclosures, and safeguards 
            are implemented and accessible within the application.
          </p>
        </div>

        {/* Compliance Areas */}
        <div className="space-y-12">
          {complianceAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.title}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-5 h-5 text-white/60" />
                  <h2 className="text-lg font-light">{area.title}</h2>
                </div>
                <div className="space-y-3">
                  {area.items.map((item) => (
                    <div 
                      key={item.name}
                      className="flex items-center justify-between border-b border-white/[0.05] pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <Link 
                          to={createPageUrl(item.page)}
                          className="text-sm text-white/80 hover:text-white transition-colors"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <span className="text-xs text-white/40 capitalize">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Standards & Frameworks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.03] p-6 border border-white/[0.08]">
              <p className="text-sm text-white/80 mb-2">GDPR</p>
              <p className="text-xs text-white/40">EU data protection regulation compliance</p>
            </div>
            <div className="bg-white/[0.03] p-6 border border-white/[0.08]">
              <p className="text-sm text-white/80 mb-2">CCPA</p>
              <p className="text-xs text-white/40">California Consumer Privacy Act compliance</p>
            </div>
            <div className="bg-white/[0.03] p-6 border border-white/[0.08]">
              <p className="text-sm text-white/80 mb-2">TCPA</p>
              <p className="text-xs text-white/40">Telephone Consumer Protection Act compliance</p>
            </div>
            <div className="bg-white/[0.03] p-6 border border-white/[0.08]">
              <p className="text-sm text-white/80 mb-2">Square API</p>
              <p className="text-xs text-white/40">Square Platform Terms compliance</p>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="mt-12 bg-white/[0.03] p-6 border border-white/[0.08]">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Compliance Audit</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Last Policy Review</span>
              <span className="text-white/40">December 26, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">AI Safety Audit</span>
              <span className="text-white/40">December 26, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Square Integration Review</span>
              <span className="text-white/40">December 26, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Data Protection Assessment</span>
              <span className="text-white/40">December 26, 2025</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 bg-white/[0.03] p-6 border border-white/[0.08]">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Compliance Inquiries</p>
          <p className="text-sm text-white/60 mb-4">
            For compliance-related questions or to request documentation:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">General Compliance</span>
              <span className="text-white/40">compliance@peskoi.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Data Protection Officer</span>
              <span className="text-white/40">privacy@peskoi.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">AI Ethics</span>
              <span className="text-white/40">ethics@peskoi.com</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}