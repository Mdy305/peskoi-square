import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Mic, 
  Calendar, 
  Settings, 
  BarChart3,
  Zap
} from "lucide-react";

export default function QuickActions({ businessCount }) {
  const actions = [
    {
      title: "Testa Live Demo",
      description: "Pröva röstassistenten direkt",
      icon: Mic,
      url: "LiveDemo",
      color: "bg-[#84CC16]",
      textColor: "text-black"
    },
    {
      title: "Se Kalender",
      description: "Hantera bokningar",
      icon: Calendar,
      url: "Calendar",
      color: "bg-blue-500",
      textColor: "text-white"
    },
    {
      title: businessCount > 0 ? "Redigera Inställningar" : "Konfigurera Företag",
      description: businessCount > 0 ? "Uppdatera företagsinfo" : "Skapa ditt företag",
      icon: Settings,
      url: "Settings",
      color: "bg-purple-500",
      textColor: "text-white"
    },
    {
      title: "Visa Statistik",
      description: "Analysera prestanda",
      icon: BarChart3,
      url: "Analytics",
      color: "bg-orange-500",
      textColor: "text-white"
    }
  ];

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#84CC16]" />
          Snabbåtkomst
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link key={action.url} to={createPageUrl(action.url)} className="block">
              <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#84CC16]/50 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className={`w-5 h-5 ${action.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-0.5">{action.title}</h4>
                    <p className="text-xs text-gray-400">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}