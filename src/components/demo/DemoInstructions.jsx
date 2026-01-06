import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Check } from "lucide-react";

export default function DemoInstructions() {
  const tips = [
    "Tala tydligt och naturligt på svenska",
    "Säg vilken tjänst du vill boka (t.ex. 'Jag vill boka en klippning')",
    "AI kommer föreslå lediga tider",
    "Bekräfta tiden du vill ha",
    "Ge ditt namn och telefonnummer",
    "Du får en bekräftelse när bokningen är klar"
  ];

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#84CC16]" />
          Så fungerar det
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
              <div className="w-6 h-6 rounded-full bg-[#84CC16]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#84CC16] text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-[#84CC16]/5 border border-[#84CC16]/20">
          <h4 className="text-[#84CC16] font-medium text-sm mb-2 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Demo-läge aktivt
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Detta är en simulerad miljö. I produktion kopplas systemet till ditt riktiga telefonnummer via Twilio och Google Calendar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}