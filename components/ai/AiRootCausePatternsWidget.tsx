"use client";

const patterns = [
  {
    id: 1,
    category: "Network-related",
    percentage: 40,
    description: "40% of P2 incidents concentrated after change windows — network config drift suspected",
    recommendation: "Add automated config validation to post-change checks",
    color: "bg-red-500",
  },
  {
    id: 2,
    category: "Storage I/O",
    percentage: 25,
    description: "Recurring latency spikes on shared storage during backup windows",
    recommendation: "Stagger backup schedules across storage arrays",
    color: "bg-amber-500",
  },
  {
    id: 3,
    category: "Authentication",
    percentage: 20,
    description: "SSO timeout errors correlate with certificate renewal cycles",
    recommendation: "Implement certificate pre-renewal 30 days before expiry",
    color: "bg-blue-500",
  },
  {
    id: 4,
    category: "Resource Exhaustion",
    percentage: 15,
    description: "Memory leak pattern in app tier every 14 days, triggers auto-restart",
    recommendation: "Schedule proactive app pool recycling on 7-day cadence",
    color: "bg-purple-500",
  },
];

export default function AiRootCausePatternsWidget() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <i className="ri-sparkling-line text-blue-500" />
        <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          AI Pattern Analysis
        </span>
      </div>
      {patterns.map((p) => (
        <div key={p.id} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${p.color}`} />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {p.category}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {p.percentage}%
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 pl-4">
            {p.description}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 pl-4">
            → {p.recommendation}
          </p>
        </div>
      ))}
      <p className="text-[10px] text-gray-400 dark:text-gray-500">
        Powered by watsonx.ai
      </p>
    </div>
  );
}
