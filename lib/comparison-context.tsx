"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type PresetRange = "mom" | "qoq" | "yoy";

interface ComparisonContextValue {
  enabled: boolean;
  toggleComparison: () => void;
  preset: PresetRange;
  setPreset: (p: PresetRange) => void;
  periodALabel: string;
  periodBLabel: string;
}

const ComparisonContext = createContext<ComparisonContextValue>({
  enabled: false,
  toggleComparison: () => {},
  preset: "mom",
  setPreset: () => {},
  periodALabel: "",
  periodBLabel: "",
});

function getLabels(preset: PresetRange): { a: string; b: string } {
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = now.getMonth();
  const y = now.getFullYear();

  switch (preset) {
    case "mom":
      return { a: `${months[m]} ${y}`, b: `${months[m === 0 ? 11 : m - 1]} ${m === 0 ? y - 1 : y}` };
    case "qoq": {
      const q = Math.floor(m / 3) + 1;
      const pq = q === 1 ? 4 : q - 1;
      const py = q === 1 ? y - 1 : y;
      return { a: `Q${q} ${y}`, b: `Q${pq} ${py}` };
    }
    case "yoy":
      return { a: `${months[m]} ${y}`, b: `${months[m]} ${y - 1}` };
  }
}

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [preset, setPreset] = useState<PresetRange>("mom");

  const toggleComparison = useCallback(() => setEnabled(prev => !prev), []);
  const labels = getLabels(preset);

  return (
    <ComparisonContext.Provider value={{ enabled, toggleComparison, preset, setPreset, periodALabel: labels.a, periodBLabel: labels.b }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  return useContext(ComparisonContext);
}
