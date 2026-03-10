export interface Notification {
  id: string;
  type: "critical" | "warning" | "info" | "system";
  category: "operational" | "system" | "collaboration";
  title: string;
  message: string;
  timestamp: string; // ISO
  widgetId?: string;
}
