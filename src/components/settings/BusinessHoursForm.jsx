import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Clock } from "lucide-react";

const defaultHours = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "16:00", closed: false },
  saturday: { open: "10:00", close: "14:00", closed: false },
  sunday: { open: null, close: null, closed: true },
};

const dayLabels = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export default function BusinessHoursForm({ business, onSave }) {
  const [hours, setHours] = useState(defaultHours);

  useEffect(() => {
    if (business?.business_hours) {
      const transformed = Object.entries(business.business_hours).reduce((acc, [day, times]) => {
        acc[day] = {
          open: times.open || "09:00",
          close: times.close || "17:00",
          closed: !times.open || !times.close,
        };
        return acc;
      }, {});
      setHours(transformed);
    }
  }, [business]);

  const updateDay = (day, field, value) => {
    setHours({
      ...hours,
      [day]: { ...hours[day], [field]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatted = Object.entries(hours).reduce((acc, [day, times]) => {
      acc[day] = times.closed
        ? { open: null, close: null }
        : { open: times.open, close: times.close };
      return acc;
    }, {});
    onSave({ business_hours: formatted });
  };

  return (
    <Card className="bg-[#0a0a0a] border-[#1f1f1f]">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#84CC16]" />
          Opening Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {Object.entries(hours).map(([day, times]) => (
            <div
              key={day}
              className="p-3 sm:p-4 rounded-lg bg-black border border-[#1f1f1f]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center justify-between sm:justify-start sm:w-32">
                  <Label className="text-xs sm:text-sm text-white">{dayLabels[day]}</Label>
                  <label className="flex items-center gap-2 cursor-pointer sm:hidden">
                    <span className="text-xs text-gray-400">Closed</span>
                    <input
                      type="checkbox"
                      checked={times.closed}
                      onChange={(e) => updateDay(day, "closed", e.target.checked)}
                      className="w-4 h-4 rounded border-[#1f1f1f] bg-[#0a0a0a] text-[#84CC16]"
                    />
                  </label>
                </div>

                {!times.closed ? (
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <div className="flex-1">
                      <Input
                        type="time"
                        value={times.open}
                        onChange={(e) => updateDay(day, "open", e.target.value)}
                        className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-400">-</span>
                    <div className="flex-1">
                      <Input
                        type="time"
                        value={times.close}
                        onChange={(e) => updateDay(day, "close", e.target.value)}
                        className="bg-[#0a0a0a] border-[#1f1f1f] text-white text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-xs sm:text-sm text-gray-500">Closed</div>
                )}

                <label className="hidden sm:flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-gray-400">Closed</span>
                  <input
                    type="checkbox"
                    checked={times.closed}
                    onChange={(e) => updateDay(day, "closed", e.target.checked)}
                    className="w-4 h-4 rounded border-[#1f1f1f] bg-[#0a0a0a] text-[#84CC16]"
                  />
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}