export type AnomalySeverity = "info" | "warning" | "critical";

export interface Anomaly {
  id: string;
  metric: string;
  widgetId: string;
  severity: AnomalySeverity;
  title: string;
  description: string;
  timestamp?: string;
  dateRange?: { from: string; to: string };
}

export type PredictionCategory = "sla" | "cost" | "capacity";

export interface Prediction {
  id: string;
  category: PredictionCategory;
  title: string;
  description: string;
  confidence: "low" | "medium" | "high";
  timeframe: string;
  metric?: string;
  widgetId?: string;
}

export interface AiInsightsResponse {
  anomalies: Anomaly[];
  predictions: Prediction[];
  generatedAt: string;
}
