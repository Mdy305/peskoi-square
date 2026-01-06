import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function RetentionAnalytics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['retentionMetrics'],
    queryFn: async () => {
      const res = await base44.functions.invoke('analyzeRetentionMetrics', {});
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  const cohorts = metrics?.cohorts || [];
  const ltvDistribution = metrics?.ltv_distribution || [];
  const strategies = metrics?.strategy_performance || [];
  const segments = metrics?.segments || [];
  const summary = metrics?.summary || {};

  const segmentColors = {
    vip: '#ffffff',
    high_value: '#a0a0a0',
    regular: '#606060',
    at_risk: '#404040'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Retention analytics</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Total clients', value: summary.total_clients },
            { label: 'Active', value: summary.active_clients },
            { label: 'Retention rate', value: `${summary.retention_rate}%` },
            { label: 'Avg LTV', value: `$${summary.avg_ltv}` }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-white/[0.08] p-6"
            >
              <p className="text-xs text-white/40 mb-2">{stat.label}</p>
              <p className="text-2xl text-white/90">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Cohort Analysis */}
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Cohort retention</p>
          <div className="border border-white/[0.08] p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cohorts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                  label={{ value: 'Retention %', angle: -90, position: 'insideLeft', style: { fill: '#ffffff40', fontSize: '11px' } }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #ffffff20',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="retention_rate" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  dot={{ fill: '#ffffff', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {cohorts.slice(-3).reverse().map((cohort) => (
              <div key={cohort.month} className="flex justify-between text-xs">
                <span className="text-white/60">{cohort.month}</span>
                <span className="text-white/40">
                  {cohort.active} of {cohort.total} active ({cohort.retention_rate}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LTV Distribution */}
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Lifetime value distribution</p>
          <div className="border border-white/[0.08] p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ltvDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="range" 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                  label={{ value: 'Clients', angle: -90, position: 'insideLeft', style: { fill: '#ffffff40', fontSize: '11px' } }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #ffffff20',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#ffffff40" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {ltvDistribution.map((bucket) => (
              <div key={bucket.range} className="flex justify-between text-xs">
                <span className="text-white/60">${bucket.range}</span>
                <span className="text-white/40">
                  {bucket.count} clients · {bucket.avg_visits} avg visits
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Performance */}
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Strategy success rates</p>
          <div className="space-y-4">
            {strategies.map((strategy) => (
              <motion.div
                key={strategy.strategy}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-white/[0.08] p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-white/80 mb-1">
                      {strategy.strategy.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-white/40">
                      {strategy.total} campaigns · {strategy.returned} returned
                    </p>
                  </div>
                  <span className="text-2xl text-white/90">{strategy.success_rate}%</span>
                </div>
                <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/40"
                    style={{ width: `${strategy.success_rate}%` }}
                  />
                </div>
                <div className="flex gap-4 mt-3 text-xs text-white/40">
                  <span>{strategy.returned} returned</span>
                  <span>{strategy.declined} declined</span>
                  <span>{strategy.pending} pending</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Client Segments */}
        <div>
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Client segments</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {segments.map((segment) => (
              <motion.div
                key={segment.segment}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-white/[0.08] p-6"
              >
                <p className="text-sm text-white/80 mb-4">
                  {segment.segment.replace(/_/g, ' ')}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Clients</span>
                    <span className="text-white/60">{segment.count}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Avg LTV</span>
                    <span className="text-white/60">${segment.avg_ltv}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Avg visits</span>
                    <span className="text-white/60">{segment.avg_visits}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}