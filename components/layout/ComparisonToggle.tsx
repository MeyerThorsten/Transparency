"use client";

import { useEffect, useRef } from "react";
import { useComparison } from "@/lib/comparison-context";

const PRESET_OPTIONS = [
  { value: "mom" as const, label: "vs Last Month" },
  { value: "qoq" as const, label: "vs Last Quarter" },
  { value: "yoy" as const, label: "vs Same Month Last Year" },
];

export default function ComparisonToggle() {
  const { enabled, toggleComparison, preset, setPreset, periodALabel, periodBLabel } = useComparison();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // Only close dropdown, not toggle comparison off
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [enabled]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleComparison}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          enabled
            ? "bg-magenta text-white"
            : "text-gray-500 dark:text-gray-400 hover:text-magenta dark:hover:text-magenta"
        }`}
        title="Toggle comparison mode"
      >
        <i className="ri-split-cells-horizontal text-sm" />
        <span className="hidden sm:inline">Compare</span>
      </button>

      {enabled && (
        <div className="absolute right-0 top-full mt-1 z-30 bg-white dark:bg-[#1C1C27] border border-gray-200 dark:border-[#2E2E3D] rounded-xl shadow-lg min-w-[200px] p-2">
          <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 mb-1">
            Comparison Period
          </div>
          {PRESET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPreset(opt.value)}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                preset === opt.value
                  ? "bg-magenta/10 text-magenta font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#262633]"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-[#2E2E3D] px-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {periodALabel} <span className="text-gray-300 dark:text-gray-600">vs</span> {periodBLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
