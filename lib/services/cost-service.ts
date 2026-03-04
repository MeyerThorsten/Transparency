import { CostBreakdown } from "@/types";
import costsData from "@/data/mock/costs.json";
import { perturb, seasonalCostFactor } from "@/lib/utils/data-variation";

const data = costsData as Record<string, CostBreakdown[]>;

export async function getCostBreakdown(customerId: string): Promise<CostBreakdown[]> {
  const items = data[customerId] ?? [];
  const sf = seasonalCostFactor(new Date());
  return items.map((c, idx) => ({
    ...c,
    currentMonth: perturb(c.currentMonth * sf, 2, `costBkCur|${idx}`, 0),
    previousMonth: perturb(c.previousMonth, 2, `costBkPrev|${idx}`, 0),
  }));
}
