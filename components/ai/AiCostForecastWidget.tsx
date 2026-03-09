"use client";

import { AreaChart } from "@tremor/react";

const forecastData = [
  { month: "Apr 2026", Projected: 142000, Optimistic: 138000, Pessimistic: 148000, Budget: 145000 },
  { month: "May 2026", Projected: 149000, Optimistic: 143000, Pessimistic: 157000, Budget: 145000 },
  { month: "Jun 2026", Projected: 155000, Optimistic: 147000, Pessimistic: 165000, Budget: 145000 },
];

export default function AiCostForecastWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <i className="ri-sparkling-line text-blue-500" />
        <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          AI Cost Forecast
        </span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        At current growth, Cloud spend will exceed budget by{" "}
        <span className="font-semibold text-red-600 dark:text-red-400">€12K in May</span>.
        Consider reserved instance migration to offset.
      </p>
      <AreaChart
        className="h-44"
        data={forecastData}
        index="month"
        categories={["Pessimistic", "Projected", "Optimistic", "Budget"]}
        colors={["rose", "blue", "emerald", "gray"]}
        valueFormatter={(v) => `€${(v / 1000).toFixed(0)}K`}
        showLegend={true}
        showGridLines={false}
        curveType="monotone"
      />
      <p className="text-[10px] text-gray-400 dark:text-gray-500">
        Powered by watsonx.ai
      </p>
    </div>
  );
}
