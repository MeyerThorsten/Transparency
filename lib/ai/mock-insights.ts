import type { AiInsightsResponse } from "@/types";

export function mockGenerateInsights(): AiInsightsResponse {
  return {
    anomalies: [
      {
        id: "a1",
        metric: "cpu",
        widgetId: "resource-utilization",
        severity: "warning",
        title: "CPU usage spike detected",
        description: "CPU utilization reached 89.3% recently, up from a 30-day average of 67.2%. This sustained increase over the past 3 days suggests growing compute demand.",
      },
      {
        id: "a2",
        metric: "p95_latency",
        widgetId: "latency-metrics",
        severity: "warning",
        title: "P95 latency trending upward",
        description: "P95 latency increased from 145ms average to 210ms over the past 3 days, which may impact user experience and SLA targets.",
      },
      {
        id: "a3",
        metric: "error_rate",
        widgetId: "error-rate-by-service",
        severity: "critical",
        title: "Auth Service error rate tripled",
        description: "Auth Service error rate jumped to 0.45%, up from a 30-day average of 0.12%. This correlates with the latency increase.",
      },
      {
        id: "a4",
        metric: "p1_mttr",
        widgetId: "mttr-trends",
        severity: "info",
        title: "P1 MTTR increased last month",
        description: "P1 mean time to resolution rose to 42 minutes, up from a 6-month average of 31 minutes. Still within SLA but worth monitoring.",
      },
    ],
    predictions: [
      {
        id: "p1",
        category: "sla",
        title: "SLA breach risk within 14 days",
        description: "SLA declining from 99.97% to 99.94% over 3 months with error rate spikes — medium risk of breaching 99.9% target within 14 days.",
        confidence: "medium",
        timeframe: "next 14 days",
        widgetId: "service-availability-trend",
      },
      {
        id: "p2",
        category: "cost",
        title: "Budget overrun projected at 4.5%",
        description: "Current costs 2.3% over budget with rising compute demand. Projected month-end overrun ~4.5% (additional ~\u20AC18,000).",
        confidence: "high",
        timeframe: "end of month",
        widgetId: "cost-overview",
      },
      {
        id: "p3",
        category: "capacity",
        title: "CPU capacity threshold in 21 days",
        description: "CPU trending upward ~1.5%/day. Will reach 90% warning threshold within 21 days without scaling.",
        confidence: "medium",
        timeframe: "next 21 days",
        widgetId: "resource-utilization",
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}
