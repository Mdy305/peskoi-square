import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, gradient = "from-blue-500 to-blue-600" }) {
  return (
    <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#2A2A2A] hover:border-[#84CC16]/30 transition-all duration-300 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-[#84CC16]' : 'text-gray-400'}`}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white group-hover:text-[#84CC16] transition-colors">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}