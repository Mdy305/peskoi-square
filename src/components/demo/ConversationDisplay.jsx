import React from "react";
import { Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConversationDisplay({ conversation, isConnected, isListening }) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-[#84CC16]/10 flex items-center justify-center mb-6">
          <Bot className="w-12 h-12 text-[#84CC16]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Redo att prata med AI-receptionisten?
        </h3>
        <p className="text-gray-400 max-w-md">
          Tryck på "Starta Samtal" för att börja en röstkonversation på svenska.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <AnimatePresence>
        {conversation.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex gap-3 ${message.speaker === 'Användare' ? 'justify-end' : 'justify-start'}`}
          >
            {message.speaker === 'AI' && (
              <div className="w-8 h-8 rounded-full bg-[#84CC16]/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#84CC16]" />
              </div>
            )}
            
            <div className={`max-w-[70%] ${message.speaker === 'Användare' ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-2xl ${
                message.speaker === 'AI' 
                  ? 'bg-[#2A2A2A] text-white' 
                  : 'bg-[#84CC16] text-black'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">{message.timestamp}</p>
            </div>

            {message.speaker === 'Användare' && (
              <div className="w-8 h-8 rounded-full bg-[#84CC16] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-black" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-[#84CC16]/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI lyssnar...</span>
          </div>
        </motion.div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0A0A0A;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2A2A2A;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #84CC16;
        }
      `}</style>
    </div>
  );
}