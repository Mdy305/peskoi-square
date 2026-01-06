import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AutoDiscoveryReport() {
  const [report, setReport] = React.useState(null);

  const { mutate: runDiscovery, isLoading } = useMutation({
    mutationFn: () => base44.functions.invoke('squareAutoDiscover', {}),
    onSuccess: (response) => {
      setReport(response.data);
    }
  });

  React.useEffect(() => {
    runDiscovery();
  }, []);

  const getStepStatus = (step) => {
    if (!report) return 'pending';
    return report.report?.[step]?.status || 'pending';
  };

  const getStepIcon = (status) => {
    if (status === 'PASSED') return <CheckCircle2 className="w-5 h-5 text-white/60" />;
    if (status === 'FAILED') return <AlertCircle className="w-5 h-5 text-white/60" />;
    if (status === 'WARNING') return <AlertCircle className="w-5 h-5 text-white/40" />;
    return <Loader2 className="w-5 h-5 text-white/40 animate-spin" />;
  };

  const steps = [
    { id: 'step1_locations', label: 'Location Discovery', key: 'locations' },
    { id: 'step2_services', label: 'Service Discovery', key: 'services' },
    { id: 'step3_staff', label: 'Staff Discovery', key: 'staff' },
    { id: 'step4_availability', label: 'Availability Verification', key: 'availability' },
    { id: 'step5_products', label: 'Product Discovery', key: 'products' },
    { id: 'step6_policies', label: 'Policy Extraction', key: 'policies' },
    { id: 'step7_validation', label: 'Data Consistency Check', key: 'validation' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="text-xs tracking-[0.3em] text-white/30 mb-4">
            AUTO-DISCOVERY ENGINE
          </div>
          <h1 className="text-2xl font-light tracking-wider">
            System Configuration
          </h1>
        </div>

        {/* System Status */}
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 border border-white/[0.08] bg-white/[0.02]"
          >
            <div className="text-white/40 text-xs tracking-wider mb-2">
              SYSTEM STATUS
            </div>
            <div className="text-white text-xl font-light tracking-wide">
              {report.status || report.report?.step8_system_status}
            </div>
            {report.message && (
              <div className="text-white/60 text-sm mt-2 tracking-wide">
                {report.message}
              </div>
            )}
          </motion.div>
        )}

        {/* Discovery Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const stepData = report?.report?.[step.id];
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-white/[0.08] p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStepIcon(status)}
                      <div className="text-white text-sm tracking-wide">
                        {step.label}
                      </div>
                    </div>
                    
                    {stepData?.count !== undefined && (
                      <div className="text-white/40 text-xs tracking-wider ml-8">
                        Found: {stepData.count} {step.key}
                      </div>
                    )}

                    {stepData?.error && (
                      <div className="text-white/40 text-xs ml-8 mt-1">
                        Error: {stepData.error}
                      </div>
                    )}

                    {stepData?.warning && (
                      <div className="text-white/40 text-xs ml-8 mt-1">
                        Warning: {stepData.warning}
                      </div>
                    )}

                    {stepData?.missing && (
                      <div className="text-white/40 text-xs ml-8 mt-1">
                        Missing: {stepData.missing.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="text-white/20 text-xs tracking-widest">
                    {status}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => runDiscovery()}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Re-scan
          </Button>

          {report?.status === 'CONNECTED' && (
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-white text-black hover:bg-white/90"
            >
              Go to Dashboard
            </Button>
          )}
        </div>

        {/* Fix Instructions */}
        {report?.status === 'PARTIALLY_CONNECTED' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 p-6 border border-white/[0.08] bg-white/[0.02]"
          >
            <div className="text-white/40 text-xs tracking-wider mb-3">
              FIX REQUIRED
            </div>
            <div className="text-white/80 text-sm tracking-wide leading-relaxed">
              PESKOI™ cannot operate until all critical items are configured in Square.
              Please fix the missing items above in your Square dashboard, then re-scan.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}