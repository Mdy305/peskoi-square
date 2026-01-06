import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WebsiteChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setMessages([{
        speaker: "assistant",
        text: "Hello! I'm your booking assistant. I can help you schedule appointments, check availability, or reschedule existing bookings. How can I help you today?",
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, {
      speaker: "user",
      text: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      // Call AI booking assistant
      const response = await base44.functions.invoke("aiBookingAssistant", {
        userMessage: userMessage,
        conversationHistory: messages.slice(-6)
      });

      if (response.data?.text) {
        setMessages(prev => [...prev, {
          speaker: "assistant",
          text: response.data.text,
          timestamp: new Date(),
          data: response.data // Store intent and booking data
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        speaker: "assistant",
        text: "I'm having trouble connecting. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-black border border-white/10 flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <p className="text-white text-sm tracking-wide">PESKOI™</p>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.speaker === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 ${
                msg.speaker === "user"
                  ? "bg-white text-black"
                  : "bg-white/5 text-white"
              }`}
            >
              <p className="text-sm tracking-wide">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 px-4 py-2">
              <p className="text-sm text-white/40">...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message"
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-white text-black text-sm tracking-wide disabled:opacity-30 hover:bg-white/90 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
}