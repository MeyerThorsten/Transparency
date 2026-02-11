import { CostBreakdown } from "@/types";
import costsData from "@/data/mock/costs.json";
import { perturb } from "@/lib/utils/data-variation";

const data = costsData as Record<string, CostBreakdown[]>;

export async function getCostBreakdown(customerId: string): Promise<CostBreakdown[]> {
  const items = data[customerId] ?? [];
  return items.map((c, idx) => ({
    ...c,
    currentMonth: perturb(c.currentMonth, 2, `costBkCur|${idx}`, 0),
    previousMonth: perturb(c.previousMonth, 2, `costBkPrev|${idx}`, 0),
  }));
}
