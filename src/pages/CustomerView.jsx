import React, { useState } from "react";

export default function CustomerView() {
  const [isRinging, setIsRinging] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  const handleCall = () => {
    setIsRinging(true);
    setTimeout(() => {
      setIsRinging(false);
      setCallConnected(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-[0.3em] mb-4">DEMO SALON</h1>
          <p className="text-sm text-white/40">AI concierge available 24/7</p>
        </div>

        <div className="space-y-8 mb-12">
          <div className="border-b border-white/[0.08] pb-4">
            <p className="text-xs text-white/30 mb-2">Phone</p>
            <p className="text-sm">+46 70 123 45 67</p>
          </div>
          
          <div className="border-b border-white/[0.08] pb-4">
            <p className="text-xs text-white/30 mb-2">Address</p>
            <p className="text-sm">Storgatan 12, Stockholm</p>
          </div>
          
          <div className="border-b border-white/[0.08] pb-4">
            <p className="text-xs text-white/30 mb-2">Hours</p>
            <p className="text-sm">Mon-Fri: 09:00-17:00</p>
            <p className="text-sm text-white/60">Sat: 10:00-14:00</p>
          </div>
        </div>

        {!callConnected ? (
          <button
            onClick={handleCall}
            disabled={isRinging}
            className="w-full border border-white/[0.08] py-6 hover:bg-white/5 transition-colors disabled:opacity-40 text-sm"
          >
            {isRinging ? 'Calling...' : 'Call to book'}
          </button>
        ) : (
          <div className="border border-white/[0.08] p-6">
            <p className="text-sm mb-4">Call connected</p>
            <p className="text-xs text-white/40 mb-6">AI assistant is helping you now</p>
            <div className="space-y-4 text-xs">
              <div className="border-l border-white/[0.08] pl-3">
                <p className="text-white/40 mb-1">AI:</p>
                <p className="text-white/60">"Hello, I can help you book an appointment. What service would you like?"</p>
              </div>
              <div className="border-l border-white/[0.08] pl-3">
                <p className="text-white/40 mb-1">You:</p>
                <p className="text-white/60">"I'd like a haircut..."</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}