import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueForecast() {
  const [scenario, setScenario] = useState('realistic');

  const { data: forecast, isLoading } = useQuery({
    queryKey: ['revenueForecast', scenario],
    queryFn: async () => {
      const res = await base44.functions.invoke('forecastMarketplaceRevenue', { scenario });
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  const projections = forecast?.projections || [];
  const summary = forecast?.summary || {};
  const assumptions = forecast?.assumptions || {};
  const tierBreakdown = forecast?.tier_breakdown || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Revenue forecast</p>

        {/* Scenario Selector */}
        <div className="flex gap-2 mb-12">
          {['conservative', 'realistic', 'optimistic'].map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-4 py-2 text-xs tracking-wide transition-colors ${
                scenario === s
                  ? 'bg-white text-black'
                  : 'border border-white/[0.08] text-white/60 hover:text-white/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Year 1 MRR', value: `$${summary.year_1_mrr?.toLocaleString() || 0}` },
            { label: 'Year 1 ARR', value: `$${summary.year_1_arr?.toLocaleString() || 0}` },
            { label: 'Year 2 MRR', value: `$${summary.year_2_mrr?.toLocaleString() || 0}` },
            { label: 'Year 2 customers', value: summary.year_2_customers?.toLocaleString() || 0 }
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

        {/* MRR Growth Chart */}
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Monthly recurring revenue</p>
          <div className="border border-white/[0.08] p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                  label={{ value: 'Month', position: 'insideBottom', offset: -5, style: { fill: '#ffffff40', fontSize: '11px' } }}
                />
                <YAxis 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #ffffff20',
                    fontSize: '12px'
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="mrr" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Customer growth</p>
          <div className="border border-white/[0.08] p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="#ffffff40"
                  style={{ fontSize: '11px' }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #ffffff20',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="customers" fill="#ffffff40" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Breakdown */}
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Tier distribution (Month 24)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(tierBreakdown).map(([tier, data]) => (
              <div key={tier} className="border border-white/[0.08] p-6">
                <p className="text-sm text-white/80 mb-4">{tier}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Customers</span>
                    <span className="text-white/60">{data.customers}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">MRR</span>
                    <span className="text-white/60">${data.mrr.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions */}
        <div>
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-8">Model assumptions</p>
          <div className="border border-white/[0.08] p-6 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Square appointment businesses</span>
              <span className="text-white/60">{assumptions.market_size?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Reachable market (5% see app)</span>
              <span className="text-white/60">{assumptions.reachable?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Conversion rate</span>
              <span className="text-white/60">{assumptions.conversion_rate?.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Monthly churn</span>
              <span className="text-white/60">{assumptions.churn_rate?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Monthly growth rate</span>
              <span className="text-white/60">{assumptions.growth_rate?.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Avg revenue per user</span>
              <span className="text-white/60">${summary.avg_revenue_per_user}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}