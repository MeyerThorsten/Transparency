import type { ViewType } from "@/types";
import { getCurrentSla, getCosts, getRisk, getChangeSuccessRate, getSlaHistory } from "@/lib/services/kpi-service";
import { getIncidentSummary, getTicketVolume, getMttrTrends } from "@/lib/services/incident-service";
import { getSecurityPosture } from "@/lib/services/security-service";
import { getResourceUtilization, getLatencyMetrics, getErrorRates, getNetworkThroughput } from "@/lib/services/infrastructure-service";

export async function gatherContext(customerId: string, view: ViewType): Promise<string> {
  switch (view) {
    case "c-level":
      return gatherCLevelContext(customerId);
    case "business":
      return gatherBusinessContext(customerId);
    case "technical":
      return gatherTechnicalContext(customerId);
    default:
      return gatherCLevelContext(customerId);
  }
}

async function gatherCLevelContext(customerId: string): Promise<string> {
  const [sla, incidents, risk, costs, security] = await Promise.all([
    getCurrentSla(customerId),
    getIncidentSummary(customerId),
    getRisk(customerId),
    getCosts(customerId),
    getSecurityPosture(customerId),
  ]);

  const totalOpen = incidents.reduce((sum, s) => sum + s.open, 0);
  const totalIncidents = incidents.reduce((sum, s) => sum + s.total, 0);
  const incidentBreakdown = incidents.map((s) => `${s.severity}: ${s.total} total, ${s.open} open`).join("; ");

  const totalCost = costs.reduce((sum, c) => sum + c.currentMonth, 0);
  const totalBudget = costs.reduce((sum, c) => sum + c.budget, 0);
  const costDelta = totalBudget > 0 ? ((totalCost - totalBudget) / totalBudget * 100).toFixed(1) : "N/A";

  const vulnSummary = security.vulnerabilities.map((v) => `${v.severity}: ${v.count}`).join(", ");

  return [
    `SLA Compliance: ${sla.toFixed(2)}% (target: 99.9%)`,
    `Incidents: ${totalIncidents} total, ${totalOpen} open (${incidentBreakdown})`,
    `Risk Score: ${risk.overall} (high: ${risk.high}, medium: ${risk.medium}, low: ${risk.low}, trend: ${risk.trend})`,
    `Monthly Cost: €${totalCost.toLocaleString()} (budget: €${totalBudget.toLocaleString()}, ${costDelta}% vs budget)`,
    `Security Score: ${security.overallScore}/100, vulnerabilities: ${vulnSummary}`,
  ].join("\n");
}

async function gatherBusinessContext(customerId: string): Promise<string> {
  const [tickets, mttr, changeRate, slaHistory] = await Promise.all([
    getTicketVolume(customerId),
    getMttrTrends(customerId),
    getChangeSuccessRate(customerId),
    getSlaHistory(customerId),
  ]);

  const latestTickets = tickets[tickets.length - 1];
  const prevTickets = tickets.length > 1 ? tickets[tickets.length - 2] : null;
  const ticketDelta = prevTickets
    ? ((latestTickets.opened - prevTickets.opened) / prevTickets.opened * 100).toFixed(1)
    : "N/A";

  const latestMttr = mttr[mttr.length - 1];
  const latestSla = slaHistory[slaHistory.length - 1];

  return [
    `Ticket Volume (${latestTickets?.month}): ${latestTickets?.opened} opened, ${latestTickets?.resolved} resolved (${ticketDelta}% vs previous month)`,
    `MTTR: P1=${latestMttr?.p1}min, P2=${latestMttr?.p2}min, P3=${latestMttr?.p3}min, P4=${latestMttr?.p4}min`,
    `Change Success Rate: ${changeRate.rate.toFixed(1)}% (trend: ${changeRate.trend})`,
    `SLA History (${latestSla?.month}): ${latestSla?.availability.toFixed(2)}% (target: ${latestSla?.target}%)`,
  ].join("\n");
}

async function gatherTechnicalContext(customerId: string): Promise<string> {
  const [utilization, latency, errors, throughput] = await Promise.all([
    getResourceUtilization(customerId),
    getLatencyMetrics(customerId),
    getErrorRates(customerId),
    getNetworkThroughput(customerId),
  ]);

  const latestUtil = utilization[utilization.length - 1];
  const latestLatency = latency[latency.length - 1];
  const latestThroughput = throughput[throughput.length - 1];

  const serviceErrors = new Map<string, number>();
  for (const e of errors) {
    serviceErrors.set(e.serviceName, e.rate);
  }
  const errorSummary = Array.from(serviceErrors.entries())
    .map(([name, rate]) => `${name}: ${rate.toFixed(3)}%`)
    .join(", ");

  return [
    `Resource Utilization: CPU=${latestUtil?.cpu.toFixed(1)}%, Memory=${latestUtil?.memory.toFixed(1)}%, Disk=${latestUtil?.disk.toFixed(1)}%`,
    `Latency: P50=${latestLatency?.p50.toFixed(0)}ms, P95=${latestLatency?.p95.toFixed(0)}ms, P99=${latestLatency?.p99.toFixed(0)}ms`,
    `Error Rates: ${errorSummary}`,
    `Network Throughput: Inbound=${latestThroughput?.inbound.toFixed(0)} Mbps, Outbound=${latestThroughput?.outbound.toFixed(0)} Mbps`,
  ].join("\n");
}
