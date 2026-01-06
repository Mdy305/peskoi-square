import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function Book() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [clientInfo, setClientInfo] = useState({ name: "", phone: "", email: "" });
  const [booking, setBooking] = useState(false);

  // Get services from Square
  const { data: servicesData } = useQuery({
    queryKey: ['squareServices'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetServices', {});
      return res.data;
    }
  });

  // Get stylists from Square
  const { data: stylistsData } = useQuery({
    queryKey: ['squareStylists'],
    queryFn: async () => {
      const res = await base44.functions.invoke('squareGetTeamMembers', {});
      return res.data;
    }
  });

  const services = servicesData?.services || [];
  const stylists = stylistsData?.team_members || [];

  // Get availability when service and stylist selected
  useEffect(() => {
    if (selectedService && selectedStylist && selectedDate) {
      fetchAvailability();
    }
  }, [selectedService, selectedStylist, selectedDate]);

  const fetchAvailability = async () => {
    try {
      const res = await base44.functions.invoke('squareGetAvailability', {
        service_variation_id: selectedService.variations[0].id,
        team_member_id: selectedStylist.id,
        start_date: selectedDate
      });
      setAvailableSlots(res.data?.availability || []);
    } catch (e) {
      setAvailableSlots([]);
    }
  };

  const createBooking = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('squareCreateBooking', {
        service_variation_id: selectedService.variations[0].id,
        team_member_id: selectedStylist.id,
        start_at: selectedTime,
        customer_note: clientInfo.name,
        customer_phone: clientInfo.phone,
        customer_email: clientInfo.email
      });
      return res.data;
    },
    onSuccess: () => {
      setStep(5);
    }
  });

  const handleBook = () => {
    setBooking(true);
    createBooking.mutate();
  };

  const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Progress */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <motion.div
                key={s}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: s <= step ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`h-[2px] flex-1 origin-left ${
                  s <= step ? 'bg-white' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Service */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Select service</p>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    onClick={() => {
                      setSelectedService(service);
                      setStep(2);
                    }}
                    className="w-full text-left border border-white/[0.08] p-6 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300"
                  >
                    <p className="text-sm mb-2">{service.name}</p>
                    <div className="flex justify-between text-xs text-white/40">
                      <span>{service.variations[0]?.duration_minutes || 0} min</span>
                      <span>${((service.variations[0]?.price_money?.amount || 0) / 100).toFixed(0)}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Stylist */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => setStep(1)}
                className="text-xs text-white/40 mb-8 hover:text-white/60 transition-colors duration-300"
              >
                ← Back
              </motion.button>
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Select stylist</p>
              <div className="space-y-2">
                {stylists.map((stylist, index) => (
                  <motion.button
                    key={stylist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    onClick={() => {
                      setSelectedStylist(stylist);
                      setStep(3);
                    }}
                    className="w-full text-left border border-white/[0.08] p-6 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300"
                  >
                    <p className="text-sm">{stylist.given_name} {stylist.family_name}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => setStep(2)}
                className="text-xs text-white/40 mb-8 hover:text-white/60 transition-colors duration-300"
              >
                ← Back
              </motion.button>
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Select date</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-12">
                {nextWeekDates.map((date, index) => (
                  <motion.button
                    key={date}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.04,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    onClick={() => setSelectedDate(date)}
                    className={`border p-4 transition-all duration-300 ${
                      selectedDate === date
                        ? 'border-white bg-white/5 scale-[1.02]'
                        : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <p className="text-xs">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </motion.button>
                ))}
              </div>

              {selectedDate && availableSlots.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Select time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, index) => (
                      <motion.button
                        key={slot.start_at}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.03,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        onClick={() => {
                          setSelectedTime(slot.start_at);
                          setStep(4);
                        }}
                        className="border border-white/[0.08] p-3 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 text-xs"
                      >
                        {new Date(slot.start_at).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {selectedDate && availableSlots.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-white/40"
                >
                  No availability
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Step 4: Client Info */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => setStep(3)}
                className="text-xs text-white/40 mb-8 hover:text-white/60 transition-colors duration-300"
              >
                ← Back
              </motion.button>
              <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-8">Your information</p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-6 mb-12"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20 transition-colors duration-300"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20 transition-colors duration-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-sm focus:outline-none focus:border-white/20 transition-colors duration-300"
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={handleBook}
                disabled={booking || !clientInfo.name || !clientInfo.phone}
                className="w-full border border-white/[0.08] p-4 hover:bg-white/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                {booking ? 'Booking...' : 'Confirm booking'}
              </motion.button>
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl font-light mb-4"
              >
                Confirmed
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-sm text-white/40"
              >
                You'll receive a confirmation shortly
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}