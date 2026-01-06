import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function Settings() {
  const { data: connection } = useQuery({
    queryKey: ['squareConnection'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetConnection', {});
      return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs text-white/40 tracking-[0.15em] uppercase mb-16"
        >
          Settings
        </motion.p>

        <div className="space-y-8">
          
          {[
            {
              title: 'Square',
              content: connection?.status === 'active' 
                ? `Connected to ${connection.location_name}`
                : 'Not connected',
              disclaimer: 'Independent integration. Square handles all payments.'
            },
            {
              title: 'Business hours',
              content: 'Synced from Square'
            },
            {
              title: 'Services',
              content: 'Managed in Service Intelligence'
            }
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="border-b border-white/[0.05] pb-8 hover:border-white/[0.12] transition-colors duration-300"
            >
              <p className="text-sm mb-3">{section.title}</p>
              <p className="text-xs text-white/40">{section.content}</p>
              {section.disclaimer && (
                <p className="text-xs text-white/30 mt-2">{section.disclaimer}</p>
              )}
            </motion.div>
          ))}

        </div>

      </div>
    </div>
  );
}