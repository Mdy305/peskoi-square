import React from "react";
import { motion } from "framer-motion";

export default function Channels() {
  const channels = [
    {
      name: "Voice (Twilio)",
      status: "LIVE",
      details: "Sofia concierge answering calls",
      requirements: null
    },
    {
      name: "Website Chat",
      status: "LIVE",
      details: "Real-time conversation handler connected",
      requirements: null
    },
    {
      name: "WhatsApp Business",
      status: "BLOCKED",
      details: "Integration not configured",
      requirements: [
        "WhatsApp Business API credentials",
        "Phone number verification",
        "Business profile setup",
        "Message template approval"
      ]
    },
    {
      name: "Instagram Direct",
      status: "BLOCKED",
      details: "Integration not configured",
      requirements: [
        "Facebook Developer App",
        "Instagram Business Account connection",
        "Messenger API access",
        "Webhook configuration"
      ]
    },
    {
      name: "Google Business Messages",
      status: "BLOCKED",
      details: "Integration not configured",
      requirements: [
        "Google Business Profile",
        "Business Messages partner access",
        "Agent registration",
        "Webhook endpoint"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-white/20 text-xs tracking-widest mb-2">CHANNELS</p>
          <p className="text-white/60 text-xs tracking-wide">
            Communication endpoints
          </p>
        </div>

        {/* Channels List */}
        <div className="space-y-12">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-white/5 pb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm tracking-wide">{channel.name}</p>
                <span className={`text-xs tracking-wide ${
                  channel.status === "LIVE" ? "text-white" : "text-white/40"
                }`}>
                  {channel.status}
                </span>
              </div>
              
              <p className="text-white/40 text-xs mb-4">{channel.details}</p>
              
              {channel.requirements && (
                <div className="text-white/30 text-xs space-y-1 ml-4">
                  <p className="text-white/40 mb-2">Required:</p>
                  {channel.requirements.map((req, idx) => (
                    <p key={idx}>· {req}</p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-white/20 text-xs tracking-wide">
            Only LIVE channels are operational
          </p>
        </motion.div>

      </div>
    </div>
  );
}