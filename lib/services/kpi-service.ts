import { MonthlySla, CostBreakdown, RiskScore } from "@/types";
import kpisData from "@/data/mock/kpis.json";
import { shiftMonth } from "@/lib/utils/date-shift";
import { perturb, perturbAbsolute, extendMonthlyData } from "@/lib/utils/data-variation";

const data = kpisData as Record<string, {
  slaHistory: MonthlySla[];
  currentSla: number;
  costs: CostBreakdown[];
  risk: RiskScore;
  changeSuccessRate: number;
  changeSuccessRateTrend: string;
}>;

export async function getSlaHistory(customerId: string): Promise<MonthlySla[]> {
  const history = data[customerId]?.slaHistory ?? [];
  const shifted = history.map((h, idx) => ({
    ...h,
    month: shiftMonth(h.month),
    availability: perturb(h.availability, 0.05, `slaAvail|${idx}`, 99.0, 100.0),
  }));
  return extendMonthlyData(shifted, "month", (month, rng) => ({
    month,
    availability: Math.round((99.85 + rng() * 0.14) * 100) / 100,
    target: shifted[0]?.target ?? 99.9,
  }));
}

export async function getCurrentSla(customerId: string): Promise<number> {
  const value = data[customerId]?.currentSla ?? 0;
  return perturb(value, 0.03, "currentSla", 99.0, 100.0);
}

export async function getCosts(customerId: string): Promise<CostBreakdown[]> {
  const items = data[customerId]?.costs ?? [];
  return items.map((c, idx) => ({
    ...c,
    currentMonth: perturb(c.currentMonth, 3, `costCur|${idx}`, 0),
    previousMonth: perturb(c.previousMonth, 3, `costPrev|${idx}`, 0),
  }));
}

export async function getRisk(customerId: string): Promise<RiskScore> {
  const r = data[customerId]?.risk ?? { overall: 0, high: 0, medium: 0, low: 0, trend: "stable" as const };
  return {
    ...r,
    overall: perturbAbsolute(r.overall, 1, "riskOverall", 0),
    high: perturbAbsolute(r.high, 1, "riskHigh", 0),
    medium: perturbAbsolute(r.medium, 1, "riskMedium", 0),
    low: perturbAbsolute(r.low, 1, "riskLow", 0),
  };
}

export async function getChangeSuccessRate(customerId: string): Promise<{ rate: number; trend: string }> {
  const d = data[customerId];
  const rate = perturb(d?.changeSuccessRate ?? 0, 1.5, "changeSuccessRate", 85, 100);
  return { rate, trend: d?.changeSuccessRateTrend ?? "stable" };
}
