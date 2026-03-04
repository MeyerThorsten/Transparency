"use client";

import { Suspense } from "react";
import { WidgetConfig } from "@/types";
import { getWidgetComponent } from "@/config/widget-registry";
import WidgetShell from "./WidgetShell";
import { AnomalyProvider } from "@/components/ai/AnomalyContext";

interface WidgetGridProps {
  widgets: WidgetConfig[];
}

function WidgetFallback({ title, size }: { title: string; size: string }) {
  return (
    <WidgetShell title={title} size={size as "small" | "medium" | "large" | "full"} loading>
      <div />
    </WidgetShell>
  );
}

export default function WidgetGrid({ widgets }: WidgetGridProps) {
  return (
    <AnomalyProvider>
      <div className="widget-grid">
        {widgets.map((config) => {
          const Component = getWidgetComponent(config.id);
          return (
            <Suspense key={config.id} fallback={<WidgetFallback title={config.title} size={config.size} />}>
              <WidgetShell title={config.title} size={config.size} widgetId={config.id}>
                <Component />
              </WidgetShell>
            </Suspense>
          );
        })}
      </div>
    </AnomalyProvider>
  );
}
