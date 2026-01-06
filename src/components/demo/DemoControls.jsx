import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";

export default function DemoControls({ isConnected, isMuted, onConnect, onDisconnect, onToggleMute }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      {!isConnected ? (
        <Button
          onClick={onConnect}
          className="bg-[#84CC16] hover:bg-[#65A30D] text-black font-medium px-8 py-6 text-lg shadow-lg shadow-[#84CC16]/30"
        >
          <Phone className="w-6 h-6 mr-2" />
          Starta Samtal
        </Button>
      ) : (
        <>
          <Button
            onClick={onToggleMute}
            variant="outline"
            className={`px-6 py-6 ${isMuted ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20' : 'border-[#2A2A2A] text-gray-400 hover:bg-[#2A2A2A]'}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          <Button
            onClick={onDisconnect}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6"
          >
            <PhoneOff className="w-6 h-6 mr-2" />
            Avsluta
          </Button>
        </>
      )}
    </div>
  );
}