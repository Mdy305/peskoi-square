import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { parseISO, isSameDay } from "date-fns";

export default function StylistCalendar({ appointments, selectedDate, stylists, filterStylist }) {
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM"
  ];

  const displayStylists = filterStylist === "all" ? stylists : [filterStylist];

  const getAppointmentsForStylistAtTime = (stylist, time) => {
    return appointments.filter(
      (apt) =>
        apt.stylist === stylist &&
        isSameDay(parseISO(apt.appointment_date), selectedDate) &&
        apt.appointment_time === time &&
        apt.status !== "cancelled" &&
        apt.status !== "no-show"
    );
  };

  const statusColors = {
    scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
    "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    completed: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with stylist names */}
        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `120px repeat(${displayStylists.length}, 1fr)` }}>
          <div className="font-semibold text-gray-400 text-sm">Time</div>
          {displayStylists.map((stylist) => (
            <Card key={stylist} className="bg-[#141414] border-[#1f1f1f]">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-[#84CC16]" />
                  {stylist}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Time slots grid */}
        <div className="space-y-2">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="grid gap-2"
              style={{ gridTemplateColumns: `120px repeat(${displayStylists.length}, 1fr)` }}
            >
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <Clock className="w-4 h-4 mr-2" />
                {time}
              </div>
              {displayStylists.map((stylist) => {
                const appts = getAppointmentsForStylistAtTime(stylist, time);
                return (
                  <Card
                    key={`${stylist}-${time}`}
                    className={`bg-[#141414] border-[#1f1f1f] min-h-[80px] ${
                      appts.length > 0 ? "border-[#84CC16]/30" : ""
                    }`}
                  >
                    <CardContent className="p-3">
                      {appts.length === 0 ? (
                        <div className="text-gray-600 text-xs text-center py-4">Available</div>
                      ) : (
                        <div className="space-y-2">
                          {appts.map((apt) => (
                            <div
                              key={apt.id}
                              className="bg-[#1f1f1f] rounded-lg p-2 border-l-4 border-[#84CC16]"
                            >
                              <div className="font-semibold text-white text-sm mb-1">
                                {apt.client_name}
                              </div>
                              <div className="flex flex-wrap gap-1 mb-1">
                                {apt.services?.slice(0, 2).map((service) => (
                                  <Badge
                                    key={service}
                                    className="bg-purple-500/20 text-purple-300 border-0 text-xs"
                                  >
                                    {service}
                                  </Badge>
                                ))}
                                {apt.services?.length > 2 && (
                                  <Badge className="bg-purple-500/20 text-purple-300 border-0 text-xs">
                                    +{apt.services.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-xs">
                                  {apt.duration_minutes} min
                                </span>
                                <Badge className={`${statusColors[apt.status]} border text-xs`}>
                                  {apt.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}