import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Edit2, Trash2 } from "lucide-react";

const statusColors = {
  "bokad": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "bekräftad": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "genomförd": "bg-[#84CC16]/10 text-[#84CC16] border-[#84CC16]/20",
  "avbokad": "bg-red-500/10 text-red-500 border-red-500/20"
};

export default function AppointmentsList({ appointments, title, onEdit, onDelete, showDate = false }) {
  if (!appointments || appointments.length === 0) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Inga bokningar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#84CC16]/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">{appointment.service}</h4>
                    <Badge className={statusColors[appointment.status] || statusColors.bokad}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <User className="w-3 h-3" />
                    {appointment.customer_name}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {showDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(appointment.appointment_date).toLocaleDateString('sv-SE', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                    )}
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
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-[#2A2A2A]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(appointment)}
                  className="flex-1 border-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Redigera
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(appointment.id)}
                  className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Radera
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}