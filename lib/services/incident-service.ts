import { Incident, IncidentSummary, TicketVolume, MttrTrend } from "@/types";
import incidentsData from "@/data/mock/incidents.json";
import { shiftISODate, shiftISODateNullable, shiftMonth } from "@/lib/utils/date-shift";
import {
  perturb,
  perturbInt,
  perturbAbsolute,
  extendMonthlyData,
  generateSyntheticIncidents,
} from "@/lib/utils/data-variation";

const data = incidentsData as Record<string, {
  incidents: Incident[];
  summary: IncidentSummary[];
  ticketVolume: TicketVolume[];
  mttrTrends: MttrTrend[];
}>;

export async function getIncidents(customerId: string): Promise<Incident[]> {
  const incidents = data[customerId]?.incidents ?? [];
  const shifted = incidents.map((i) => ({
    ...i,
    createdAt: shiftISODate(i.createdAt),
    resolvedAt: shiftISODateNullable(i.resolvedAt),
  }));
  const synthetic = generateSyntheticIncidents(incidents.length);
  return [...shifted, ...synthetic];
}

export async function getIncidentSummary(customerId: string): Promise<IncidentSummary[]> {
  const items = data[customerId]?.summary ?? [];
  return items.map((s, idx) => {
    const openDelta = perturbAbsolute(0, 1, `summaryOpen|${idx}`);
    const open = Math.max(0, s.open + openDelta);
    const resolved = Math.max(0, s.resolved - openDelta);
    return { ...s, open, resolved, total: open + resolved };
  });
}

export async function getTicketVolume(customerId: string): Promise<TicketVolume[]> {
  const volume = data[customerId]?.ticketVolume ?? [];
  const shifted = volume.map((v, idx) => ({
    ...v,
    month: shiftMonth(v.month),
    opened: perturbInt(v.opened, 5, `ticketOpened|${idx}`, 0),
    resolved: perturbInt(v.resolved, 5, `ticketResolved|${idx}`, 0),
  }));
  return extendMonthlyData(shifted, "month", (month, rng) => ({
    month,
    opened: Math.round(40 + rng() * 30),
    resolved: Math.round(38 + rng() * 30),
  }));
}

export async function getMttrTrends(customerId: string): Promise<MttrTrend[]> {
  const trends = data[customerId]?.mttrTrends ?? [];
  const shifted = trends.map((t, idx) => ({
    ...t,
    month: shiftMonth(t.month),
    p1: perturb(t.p1, 8, `mttrP1|${idx}`, 0),
    p2: perturb(t.p2, 8, `mttrP2|${idx}`, 0),
    p3: perturb(t.p3, 8, `mttrP3|${idx}`, 0),
    p4: perturb(t.p4, 8, `mttrP4|${idx}`, 0),
  }));
  return extendMonthlyData(shifted, "month", (month, rng) => ({
    month,
    p1: Math.round(20 + rng() * 40),
    p2: Math.round(40 + rng() * 60),
    p3: Math.round(100 + rng() * 120),
    p4: Math.round(200 + rng() * 200),
  }));
}

export async function getOpenIncidents(customerId: string): Promise<Incident[]> {
  const all = await getIncidents(customerId);
  return all.filter((i) => i.status === "open" || i.status === "investigating");
}
