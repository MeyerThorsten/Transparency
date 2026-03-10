"use client";

import { ReactNode } from "react";
import { useComparison } from "@/lib/comparison-context";

interface ComparisonWrapperProps {
  children: ReactNode;
  previousChildren?: ReactNode;
}

export default function ComparisonWrapper({ children, previousChildren }: ComparisonWrapperProps) {
  const { periodALabel, periodBLabel } = useComparison();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-[10px] font-medium text-magenta mb-2 uppercase tracking-wide">{periodALabel}</div>
        {children}
      </div>
      <div className="opacity-75">
        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">{periodBLabel}</div>
        {previousChildren || children}
      </div>
    </div>
  );
}
