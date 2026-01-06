import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI booking assistant. I can help you book appointments, reschedule, check availability, or answer questions about our services. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [pendingBooking, setPendingBooking] = useState(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [squareCustomerId, setSquareCustomerId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch services from Square
  const { data: servicesData } = useQuery({
    queryKey: ['squareServices'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetServices', {});
      return res.data;
    }
  });

  const services = servicesData?.services || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      const conversationHistory = messages.map(m => ({
        speaker: m.role === 'user' ? 'Client' : 'Assistant',
        text: m.content
      }));

      const res = await base44.functions.invoke('aiBookingAssistant', {
        userMessage: message,
        conversationHistory,
        session_id: sessionId,
        square_customer_id: squareCustomerId,
        selected_service_variation_id: selectedService
      });
      return res.data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
        intent: data.intent,
        sentiment: data.sentiment,
        data: data
      }]);

      if (data.intent === 'show_availability' || data.intent === 'reschedule_availability' || data.intent === 'cancel_with_reschedule') {
        setPendingBooking(data);
      }

      // Show visual indicator for urgent issues
      if (data.sentiment === 'urgent' || data.sentiment === 'negative') {
        console.warn('Urgent issue flagged for human review');
      }
    }
  });

  const confirmBookingMutation = useMutation({
    mutationFn: async ({ slot, bookingDetails }) => {
      // Validate contact info
      if (!bookingDetails.client_name || !bookingDetails.client_phone) {
        throw new Error('Name and phone number required');
      }

      // Use selected service or fallback to pending booking service
      const serviceVariationId = selectedService || pendingBooking.service_variation_id;
      
      if (!serviceVariationId) {
        throw new Error('Please select a service first');
      }

      const res = await base44.functions.invoke('squareCreateBooking', {
        service_variation_id: serviceVariationId,
        start_at: slot.start_at,
        customer_name: bookingDetails.client_name,
        customer_phone: bookingDetails.client_phone,
        customer_email: bookingDetails.client_email,
        customer_note: "AI Booking Assistant"
      });
      return res.data;
    },
    onSuccess: async (data) => {
      // Transition to BOOKED state
      if (squareCustomerId) {
        try {
          await base44.functions.invoke('manageCustomerIntent', {
            square_customer_id: squareCustomerId,
            action: 'confirm_booking',
            channel: 'web',
            intent_data: {
              booking_id: data.booking?.id
            }
          });
        } catch (err) {
          console.error('Failed to update intent:', err);
        }
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Perfect! Your appointment is confirmed. You'll receive a confirmation SMS shortly.",
        timestamp: new Date()
      }]);
      setPendingBooking(null);
    },
    onError: (error) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `I apologize, but I couldn't complete the booking: ${error.message}. Please try again or contact us directly.`,
        timestamp: new Date()
      }]);
    }
  });

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(input.trim());
    setInput("");
  };

  const handleBookSlot = (slot) => {
    const bookingDetails = pendingBooking?.booking_details;
    
    if (!bookingDetails?.client_name || !bookingDetails?.client_phone) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "To complete your booking, I need your full name and phone number. Please provide them in your next message (e.g., 'John Smith, 555-123-4567').",
        timestamp: new Date()
      }]);
      
      // Store selected slot for later
      setPendingBooking({
        ...pendingBooking,
        selected_slot: slot,
        awaiting_contact: true
      });
      return;
    }

    confirmBookingMutation.mutate({
      slot,
      bookingDetails
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-screen">
        
        {/* Header */}
        <div className="border-b border-white/[0.08] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <p className="text-sm font-medium">AI Booking Assistant</p>
                <p className="text-xs text-white/40">Available 24/7</p>
              </div>
            </div>

            {/* Service Selector */}
            {services.length > 0 && (
              <select
                value={selectedService || ''}
                onChange={(e) => setSelectedService(e.target.value || null)}
                className="bg-transparent border border-white/[0.08] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-white/20 transition-colors"
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <optgroup key={service.id} label={service.name}>
                    {service.variations.map((variation) => (
                      <option key={variation.id} value={variation.id}>
                        {variation.name} - ${variation.price.toFixed(0)} ({variation.duration_minutes}min)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-white text-black' : 'bg-white/5 text-white'} rounded-2xl px-4 py-3 ${
                  message.sentiment === 'urgent' || message.sentiment === 'negative' ? 'border border-red-500/30' : ''
                }`}>
                  {(message.sentiment === 'urgent' || message.sentiment === 'negative') && message.role === 'user' && (
                    <div className="text-xs text-red-400 mb-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      Flagged for review
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {/* Show booking slots if available */}
                  {message.data?.available_slots && message.data.needs_confirmation && (
                    <div className="mt-4 space-y-2">
                      {message.data.available_slots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => handleBookSlot(slot)}
                          disabled={confirmBookingMutation.isPending}
                          className="w-full text-left border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors text-xs"
                        >
                          <span className="font-medium">{slot.date}</span>
                          <span className="text-white/60"> at {slot.time}</span>
                          {slot.team_member && slot.team_member !== 'Available' && (
                            <span className="text-white/40"> • {slot.team_member}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-white/30 mt-2">
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sendMessageMutation.isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                <p className="text-sm text-white/40">Thinking...</p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.08] px-4 sm:px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              disabled={sendMessageMutation.isPending}
              className="flex-1 bg-transparent border border-white/[0.08] rounded-full px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sendMessageMutation.isPending}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}