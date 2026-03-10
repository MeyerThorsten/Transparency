"use client";

interface DeltaIndicatorProps {
  current: number;
  previous: number;
  higherIsBetter?: boolean;
}

export default function DeltaIndicator({ current, previous, higherIsBetter = true }: DeltaIndicatorProps) {
  if (previous === 0) return null;
  const pctChange = ((current - previous) / Math.abs(previous)) * 100;
  const isPositive = pctChange > 0;
  const isBetter = higherIsBetter ? isPositive : !isPositive;
  const sign = isPositive ? "+" : "";
  const color = isBetter ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400";
  const icon = isPositive ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line";

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`}>
      <i className={`${icon} text-sm`} />
      {sign}{pctChange.toFixed(1)}%
    </span>
  );
}
