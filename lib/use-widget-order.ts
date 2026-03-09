"use client";

import { useState, useCallback, useEffect } from "react";
import { WidgetConfig } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";

function getStorageKey(view: string) {
  return `widget-order:${view}`;
}

export function useWidgetOrder(view: string, defaults: WidgetConfig[]) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaults);
  const [hasCustomOrder, setHasCustomOrder] = useState(false);

  // Load saved order from localStorage on mount and when view changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(view));
      if (saved) {
        const savedIds: string[] = JSON.parse(saved);
        const defaultMap = new Map(defaults.map((w) => [w.id, w]));

        // Reconstruct from saved order, dropping removed widgets
        const ordered: WidgetConfig[] = [];
        for (const id of savedIds) {
          const config = defaultMap.get(id);
          if (config) {
            ordered.push(config);
            defaultMap.delete(id);
          }
        }
        // Append any new defaults not in saved order
        for (const config of defaultMap.values()) {
          ordered.push(config);
        }

        setWidgets(ordered);
        setHasCustomOrder(true);
      } else {
        setWidgets(defaults);
        setHasCustomOrder(false);
      }
    } catch {
      setWidgets(defaults);
      setHasCustomOrder(false);
    }
  }, [view, defaults]);

  const reorder = useCallback(
    (activeId: string, overId: string) => {
      setWidgets((prev) => {
        const oldIndex = prev.findIndex((w) => w.id === activeId);
        const newIndex = prev.findIndex((w) => w.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const next = arrayMove(prev, oldIndex, newIndex);
        localStorage.setItem(
          getStorageKey(view),
          JSON.stringify(next.map((w) => w.id))
        );
        setHasCustomOrder(true);
        return next;
      });
    },
    [view]
  );

  const reset = useCallback(() => {
    localStorage.removeItem(getStorageKey(view));
    setWidgets(defaults);
    setHasCustomOrder(false);
  }, [view, defaults]);

  return { widgets, reorder, reset, hasCustomOrder };
}
