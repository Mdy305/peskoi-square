import React from "react";
import { motion } from "framer-motion";

export default function ChatTrigger({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors z-40"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </motion.button>
  );
}