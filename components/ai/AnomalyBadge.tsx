"use client";

import { useAnomalies } from "./AnomalyContext";
import type { AnomalySeverity } from "@/types";

const styles: Record<AnomalySeverity, string> = {
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AnomalyBadge({ widgetId }: { widgetId: string }) {
  const { getAnomaliesForWidget } = useAnomalies();
  const anomalies = getAnomaliesForWidget(widgetId);
  if (anomalies.length === 0) return null;

  const highest = anomalies.reduce((max, a) => {
    const order = { critical: 3, warning: 2, info: 1 };
    return order[a.severity] > order[max.severity] ? a : max;
  }, anomalies[0]);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${styles[highest.severity]}`}
      title={highest.title}
    >
      {anomalies.length} anomal{anomalies.length === 1 ? "y" : "ies"}
    </span>
  );
}
