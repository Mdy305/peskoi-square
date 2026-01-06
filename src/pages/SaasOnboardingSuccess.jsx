import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function SaasOnboardingSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl("SaasDashboard"));
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-light mb-4">Square Connected!</h1>
        <p className="text-white/40 text-sm">
          Your client is now ready to accept bookings and payments.
        </p>
        <p className="text-white/40 text-xs mt-4">
          Redirecting to dashboard...
        </p>
      </motion.div>
    </div>
  );
}