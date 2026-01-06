import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

export default function StylistPerformance() {
  const [compareMode, setCompareMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: performance, isLoading } = useQuery({
    queryKey: ['stylistPerformance'],
    queryFn: async () => {
      const res = await base44.functions.invoke('analyzeStylistPerformance', {});
      return res.data;
    },
    refetchOnWindowFocus: false
  });

  const refreshAnalysis = useMutation({
    mutationFn: () => base44.functions.invoke('analyzeStylistPerformance', {}),
    onSuccess: () => {
      queryClient.invalidateQueries(['stylistPerformance']);
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!performance?.success) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-white/40">No booking data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = performance.stylists.map(s => ({
    name: s.stylist_name.split(' ')[0],
    revenue: s.total_revenue,
    bookings: s.total_bookings,
    retention: s.retention_rate
  }));

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-12">
          <p className="text-xs text-white/40 tracking-[0.15em] uppercase">Stylist performance</p>
          <div className="flex gap-6">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {compareMode ? 'Table' : 'Compare'}
            </button>
            <button
              onClick={() => refreshAnalysis.mutate()}
              disabled={refreshAnalysis.isPending}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {refreshAnalysis.isPending ? 'Analyzing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-8 mb-16">
          <div>
            <p className="text-3xl font-light mb-2">{performance.summary.total_stylists}</p>
            <p className="text-xs text-white/40">Stylists</p>
          </div>
          <div>
            <p className="text-3xl font-light mb-2">{performance.summary.total_bookings}</p>
            <p className="text-xs text-white/40">Bookings</p>
          </div>
          <div>
            <p className="text-3xl font-light mb-2">${performance.summary.total_revenue}</p>
            <p className="text-xs text-white/40">Revenue</p>
          </div>
          <div>
            <p className="text-3xl font-light mb-2">{performance.summary.avg_retention_rate}%</p>
            <p className="text-xs text-white/40">Avg retention</p>
          </div>
        </div>

        {/* Charts */}
        {compareMode && chartData.length > 0 && (
          <div className="mb-16 space-y-12">
            <div>
              <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Revenue</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#444" style={{ fontSize: 11 }} />
                  <YAxis stroke="#444" style={{ fontSize: 11 }} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={`rgba(255, 255, 255, ${0.15 + (i * 0.1)})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Bookings</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#444" style={{ fontSize: 11 }} />
                  <YAxis stroke="#444" style={{ fontSize: 11 }} />
                  <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={`rgba(255, 255, 255, ${0.15 + (i * 0.1)})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Retention</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#444" style={{ fontSize: 11 }} />
                  <YAxis stroke="#444" style={{ fontSize: 11 }} domain={[0, 100]} />
                  <Bar dataKey="retention" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={`rgba(255, 255, 255, ${0.15 + (i * 0.1)})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Individual Performance */}
        {!compareMode && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Individual metrics</p>
            <div className="space-y-6">
              {performance.stylists.map(stylist => (
                <div key={stylist.stylist_id} className="border-b border-white/[0.05] pb-6">
                  <p className="text-sm mb-4">{stylist.stylist_name}</p>
                  
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-white/40 mb-1">Bookings</p>
                      <p className="text-white/80">{stylist.total_bookings}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">Revenue</p>
                      <p className="text-white/80">${stylist.total_revenue.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">Avg value</p>
                      <p className="text-white/80">${stylist.avg_booking_value}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">Retention</p>
                      <p className="text-white/80">{stylist.retention_rate}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                    <div>
                      <p className="text-white/30 mb-1">Completion</p>
                      <p className="text-white/60">{stylist.completion_rate}%</p>
                    </div>
                    <div>
                      <p className="text-white/30 mb-1">Unique clients</p>
                      <p className="text-white/60">{stylist.unique_clients}</p>
                    </div>
                    <div>
                      <p className="text-white/30 mb-1">Repeat clients</p>
                      <p className="text-white/60">{stylist.repeat_clients}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Performers */}
        {performance.insights?.top_performers?.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Top performers</p>
            <div className="space-y-4">
              {performance.insights.top_performers.map((perf, i) => (
                <div key={i} className="border border-white/[0.08] p-6">
                  <p className="text-sm mb-2">{perf.stylist}</p>
                  <p className="text-xs text-white/60 mb-2">{perf.strength}</p>
                  <p className="text-xs text-white/40">{perf.metric}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Needs Support */}
        {performance.insights?.needs_support?.length > 0 && (
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Coaching opportunities</p>
            <div className="space-y-4">
              {performance.insights.needs_support.map((support, i) => (
                <div key={i} className="border border-white/[0.08] p-6">
                  <p className="text-sm mb-2">{support.stylist}</p>
                  <p className="text-xs text-white/60 mb-2">{support.issue}</p>
                  <p className="text-xs text-white/40">{support.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Insights */}
        {performance.insights?.team_insights?.length > 0 && (
          <div>
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-6">Team insights</p>
            <div className="space-y-3">
              {performance.insights.team_insights.map((insight, i) => (
                <div key={i} className="border-b border-white/[0.05] pb-3">
                  <p className="text-xs text-white/60 mb-1">{insight.observation}</p>
                  <p className="text-xs text-white/40">{insight.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}