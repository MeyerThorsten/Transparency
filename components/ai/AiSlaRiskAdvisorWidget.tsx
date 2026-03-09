"use client";

const services = [
  { name: "SAP S/4HANA", uptime: 99.952, trend: "declining" as const, risk: "high" as const },
  { name: "Cloud IaaS", uptime: 99.978, trend: "stable" as const, risk: "medium" as const },
  { name: "SD-WAN Connectivity", uptime: 99.991, trend: "stable" as const, risk: "low" as const },
  { name: "Managed Security", uptime: 99.985, trend: "improving" as const, risk: "low" as const },
  { name: "Workplace Services", uptime: 99.965, trend: "declining" as const, risk: "medium" as const },
];

const riskColors = {
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
};

const trendIcons = {
  declining: "ri-arrow-down-line text-red-500",
  stable: "ri-arrow-right-line text-gray-400",
  improving: "ri-arrow-up-line text-green-500",
};

export default function AiSlaRiskAdvisorWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <i className="ri-sparkling-line text-blue-500" />
        <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          30-Day SLA Risk Forecast
        </span>
      </div>
      <div className="space-y-2">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-[#2E2E3D] px-3 py-2"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {s.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {s.uptime.toFixed(3)}% current
              </p>
            </div>
            <i className={`${trendIcons[s.trend]} text-sm`} />
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${riskColors[s.risk]}`}
            >
              {s.risk}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500">
        Powered by watsonx.ai
      </p>
    </div>
  );
}
