import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, FileText } from "lucide-react";

const statusColors = {
  "pågående": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "avslutad": "bg-[#84CC16]/10 text-[#84CC16] border-[#84CC16]/20",
  "missad": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "fel": "bg-red-500/10 text-red-500 border-red-500/20"
};

export default function CallDetailsModal({ call, isOpen, onClose }) {
  if (!call) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#84CC16]" />
            Samtalsdetaljer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <p className="text-sm text-gray-400 mb-1">Från</p>
              <p className="text-white font-medium">{call.from_number || 'Okänt'}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <p className="text-sm text-gray-400 mb-1">Till</p>
              <p className="text-white font-medium">{call.to_number || 'Okänt'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Calendar className="w-3 h-3" />
                <p className="text-sm">Datum</p>
              </div>
              <p className="text-white font-medium">
                {new Date(call.created_date).toLocaleDateString('sv-SE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="w-3 h-3" />
                <p className="text-sm">Längd</p>
              </div>
              <p className="text-white font-medium">
                {call.duration_seconds 
                  ? `${Math.floor(call.duration_seconds / 60)}:${(call.duration_seconds % 60).toString().padStart(2, '0')}`
                  : '-'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <Badge className={statusColors[call.status]}>
                {call.status}
              </Badge>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
            <p className="text-sm text-gray-400 mb-2">Typ</p>
            <Badge variant="outline" className="text-gray-300 border-[#2A2A2A]">
              {call.call_type}
            </Badge>
          </div>

          {call.summary && (
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <FileText className="w-4 h-4" />
                <p className="text-sm font-medium">Sammanfattning</p>
              </div>
              <p className="text-white leading-relaxed">{call.summary}</p>
            </div>
          )}

          {call.transcript && (
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <p className="text-sm font-medium text-gray-400 mb-3">Transkription</p>
              <div className="text-white text-sm leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {call.transcript}
              </div>
            </div>
          )}

          {call.cost_sek && (
            <div className="p-4 rounded-lg bg-[#84CC16]/5 border border-[#84CC16]/20">
              <p className="text-sm text-gray-400 mb-1">Kostnad</p>
              <p className="text-[#84CC16] font-medium">{call.cost_sek} kr</p>
            </div>
          )}
        </div>

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
      </DialogContent>
    </Dialog>
  );
}