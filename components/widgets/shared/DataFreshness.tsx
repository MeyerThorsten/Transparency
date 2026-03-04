"use client";

import { useEffect, useState } from "react";

export default function DataFreshness() {
  const [minutesAgo, setMinutesAgo] = useState(0);

  useEffect(() => {
    // Simulate data freshness: 1-15 minutes ago based on current time
    const now = new Date();
    const minutes = (now.getMinutes() % 15) + 1;
    setMinutesAgo(minutes);
  }, []);

  const color = minutesAgo <= 5
    ? "bg-emerald-500"
    : minutesAgo <= 10
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {minutesAgo}m ago
    </div>
  );
}
