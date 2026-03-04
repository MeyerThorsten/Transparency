import type { ViewType } from "@/types";

const MOCK_SUMMARIES: Record<ViewType, string> = {
  "c-level":
    "Overall service delivery is healthy with SLA compliance above target at 99.94%. There is one active P1 incident currently under investigation that requires executive attention. Security posture remains strong with a score of 87/100. Infrastructure costs are tracking 2.3% above budget this month, primarily driven by increased compute usage.",
  business:
    "Ticket volume has decreased 8% month-over-month, indicating improving service stability. Mean time to resolve P1 incidents has improved to 28 minutes, well within the 30-minute target. Change success rate remains high at 97.2%. SLA compliance across all monitored services is above contracted thresholds.",
  technical:
    "CPU utilization is averaging 67% across monitored hosts with memory at 72% — both within normal operating ranges. P95 latency is at 145ms, a slight increase from last week. Error rates remain below 0.5% across all services. Network throughput is stable with no anomalies detected in DNS resolution times.",
};

const MOCK_CHAT_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ["latency", "slow", "response time", "p95", "p99"],
    response: "Based on the current data, P95 latency is at 145ms and P99 at 320ms. These are within normal ranges but show a slight upward trend over the past week. The primary contributors are the API Gateway and Authentication services.",
  },
  {
    keywords: ["incident", "outage", "down", "issue"],
    response: "There are currently 3 open incidents: 1 P1 (Authentication Service degradation, under investigation for 45 minutes), 1 P3 (DNS resolution intermittent delays), and 1 P4 (Dashboard rendering slow for some users). The P1 is the most critical and the team is actively working on it.",
  },
  {
    keywords: ["cost", "budget", "spend", "expensive"],
    response: "Current month infrastructure costs are at €847,200, which is 2.3% over the monthly budget of €828,000. The primary driver is increased compute usage in the EU-West region. Previous month costs were €831,500, so there's an upward trend worth monitoring.",
  },
  {
    keywords: ["security", "vulnerability", "cve", "patch"],
    response: "Security posture score is 87/100. There are 3 critical vulnerabilities pending remediation, 12 high-severity, and 28 medium. Patch compliance is at 94% overall. The critical CVEs affect the Java runtime and should be prioritized for the next maintenance window.",
  },
  {
    keywords: ["sla", "availability", "uptime"],
    response: "Current SLA compliance is at 99.94%, above the 99.9% target. All monitored services are meeting their individual SLA thresholds. The lowest-performing service is the Payment Gateway at 99.91%, still above target but worth monitoring.",
  },
];

const DEFAULT_CHAT_RESPONSE =
  "Based on the available dashboard data, I can see that overall system health is good. Could you ask a more specific question about latency, incidents, costs, security, or SLA compliance? I can provide more detailed analysis on those topics.";

export function mockGenerateSummary(view: ViewType): string {
  return MOCK_SUMMARIES[view] ?? MOCK_SUMMARIES["c-level"];
}

export function mockGenerateChat(question: string): string {
  const lower = question.toLowerCase();
  for (const entry of MOCK_CHAT_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  return DEFAULT_CHAT_RESPONSE;
}
