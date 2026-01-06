import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CalendarView({ appointments, selectedDate, onDateSelect, onAppointmentClick }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December"
  ];

  const dayNames = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointment_date === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Empty cells for days before month starts
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateAppointments = getAppointmentsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(date)}
          className={`
            p-3 border transition-all cursor-pointer
            ${isSelected ? 'border-white bg-white/5' : 'border-white/[0.08] hover:border-white/20'}
            ${isToday && !isSelected ? 'border-white/20' : ''}
          `}
        >
          <div className="text-center">
            <div className={`text-xs mb-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>
              {day}
            </div>
            {dateAppointments.length > 0 && (
              <div className="w-1 h-1 bg-white/60 rounded-full mx-auto" />
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-black border border-white/[0.08] p-6">
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm tracking-wide">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </p>
        <div className="flex gap-3">
          <button
            onClick={previousMonth}
            className="text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextMonth}
            className="text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs text-white/30 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
}