import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, CheckCircle, XCircle, Info, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

const outcomeConfig = {
  "bokad": { icon: CheckCircle, color: "text-[#84CC16]", bg: "bg-[#84CC16]/10", label: "Bokad" },
  "information": { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", label: "Information" },
  "ingen_åtgärd": { icon: XCircle, color: "text-gray-500", bg: "bg-gray-500/10", label: "Ingen åtgärd" },
  "misslyckad": { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Misslyckad" }
};

export default function RecentCalls({ callLogs }) {
  if (!callLogs || callLogs.length === 0) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#84CC16]" />
            Senaste Samtal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Phone className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Inga samtal än</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#84CC16]" />
          Senaste Samtal
        </CardTitle>
        <Link to={createPageUrl("CallHistory")}>
          <Button variant="ghost" size="sm" className="text-[#84CC16] hover:text-[#84CC16] hover:bg-[#84CC16]/10">
            Se alla
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {callLogs.map((call) => {
            const config = outcomeConfig[call.outcome] || outcomeConfig.ingen_åtgärd;
            const Icon = config.icon;
            
            return (
              <div
                key={call.id}
                className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#84CC16]/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <Badge variant="outline" className="text-gray-400 border-[#2A2A2A]">
                    {call.call_type}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Från</p>
                    <p className="text-sm text-white font-medium">{call.from_number || 'Okänt nummer'}</p>
                  </div>
                  
                  {call.duration_seconds && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {Math.floor(call.duration_seconds / 60)}:{(call.duration_seconds % 60).toString().padStart(2, '0')} min
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-[#2A2A2A]">
                    <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}