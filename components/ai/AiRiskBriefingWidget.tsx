"use client";

import StatusBadge from "@/components/widgets/shared/StatusBadge";

const riskItems = [
  {
    id: 1,
    severity: "critical" as const,
    icon: "ri-alarm-warning-line",
    text: "SLA margin narrowed to 0.04% — recommend change freeze until buffer recovers",
  },
  {
    id: 2,
    severity: "warning" as const,
    icon: "ri-error-warning-line",
    text: "Two P2 incidents in SAP environment within 48h suggest elevated operational risk",
  },
  {
    id: 3,
    severity: "warning" as const,
    icon: "ri-shield-keyhole-line",
    text: "3 critical CVEs unpatched for 14+ days across web-tier servers — escalation recommended",
  },
  {
    id: 4,
    severity: "info" as const,
    icon: "ri-information-line",
    text: "Quarterly change volume trending 18% above baseline — monitor for change collision risk",
  },
];

const severityColors = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

export default function AiRiskBriefingWidget() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <i className="ri-sparkling-line text-blue-500" />
        <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          AI Risk Assessment
        </span>
      </div>
      {riskItems.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <i
            className={`${item.icon} text-lg mt-0.5 ${
              item.severity === "critical"
                ? "text-red-500"
                : item.severity === "warning"
                ? "text-amber-500"
                : "text-blue-500"
            }`}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <StatusBadge
                label={item.severity}
                variant={severityColors[item.severity]}
              />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {item.text}
            </p>
          </div>
        </div>
      ))}
      <p className="text-[10px] text-gray-400 dark:text-gray-500">
        Powered by watsonx.ai
      </p>
    </div>
  );
}
