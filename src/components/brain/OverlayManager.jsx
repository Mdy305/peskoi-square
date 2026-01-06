import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConversationSummaryOverlay from "./overlays/ConversationSummaryOverlay";
import ConversationLogOverlay from "./overlays/ConversationLogOverlay";
import CallAgentStatusOverlay from "./overlays/CallAgentStatusOverlay";
import SystemHealthOverlay from "./overlays/SystemHealthOverlay";

export default function OverlayManager({ overlay, onClose }) {
  if (!overlay) return null;

  const renderOverlay = () => {
    switch (overlay.type) {
      case 'ConversationSummary':
        return <ConversationSummaryOverlay data={overlay.data} />;
      case 'ConversationLog':
        return <ConversationLogOverlay data={overlay.data} />;
      case 'CallAgentStatus':
        return <CallAgentStatusOverlay data={overlay.data} />;
      case 'SystemHealth':
        return <SystemHealthOverlay data={overlay.data} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-black border border-white/[0.08] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          {/* Overlay Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {renderOverlay()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}