import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const statusColors = {
  "bokad": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "bekräftad": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "genomförd": "bg-[#84CC16]/10 text-[#84CC16] border-[#84CC16]/20",
  "avbokad": "bg-red-500/10 text-red-500 border-red-500/20"
};

export default function RecentAppointments({ appointments }) {
  if (!appointments || appointments.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#84CC16]" />
            Senaste Bokningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#84CC16]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#84CC16]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Inga bokningar än</h3>
            <p className="text-gray-400 mb-6">Börja ta emot bokningar via AI-assistenten</p>
            <Link to={createPageUrl("LiveDemo")}>
              <Button className="bg-gradient-to-r from-[#84CC16] to-[#65A30D] hover:from-[#65A30D] hover:to-[#84CC16] text-black font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Testa Demo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#2A2A2A]">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#2A2A2A]">
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#84CC16]" />
          Senaste Bokningar
        </CardTitle>
        <Link to={createPageUrl("Calendar")}>
          <Button variant="ghost" size="sm" className="text-[#84CC16] hover:text-[#84CC16] hover:bg-[#84CC16]/10">
            Se alla
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 rounded-xl bg-[#0A0A0A]/50 border border-[#2A2A2A] hover:border-[#84CC16]/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-semibold group-hover:text-[#84CC16] transition-colors">
                      {appointment.service}
                    </h4>
                    <Badge className={statusColors[appointment.status] || statusColors.bokad}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="w-3 h-3" />
                    {appointment.customer_name}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(appointment.appointment_date).toLocaleDateString('sv-SE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {appointment.appointment_time}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {appointment.customer_phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}