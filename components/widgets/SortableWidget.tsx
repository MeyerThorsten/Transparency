"use client";

import { Suspense } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WidgetConfig } from "@/types";
import { getWidgetComponent } from "@/config/widget-registry";
import WidgetShell from "./WidgetShell";

interface SortableWidgetProps {
  config: WidgetConfig;
}

function WidgetFallback({ title, size }: { title: string; size: string }) {
  return (
    <WidgetShell title={title} size={size as "small" | "medium" | "large" | "full"} loading>
      <div />
    </WidgetShell>
  );
}

export default function SortableWidget({ config }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: config.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Component = getWidgetComponent(config.id);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Suspense fallback={<WidgetFallback title={config.title} size={config.size} />}>
        <WidgetShell
          title={config.title}
          size={config.size}
          widgetId={config.id}
          dragListeners={listeners}
        >
          <Component />
        </WidgetShell>
      </Suspense>
    </div>
  );
}
