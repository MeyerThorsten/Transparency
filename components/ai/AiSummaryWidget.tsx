"use client";

import { useEffect, useState } from "react";
import { useCustomer } from "@/lib/customer-context";
import type { ViewType } from "@/types";

function getViewFromUrl(): ViewType {
  if (typeof window === "undefined") return "c-level";
  const params = new URLSearchParams(window.location.search);
  return (params.get("view") as ViewType) || "c-level";
}

export default function AiSummaryWidget() {
  const { customer } = useCustomer();
  const [view, setView] = useState<ViewType>(getViewFromUrl);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for URL changes (popstate + custom event for pushState)
  useEffect(() => {
    const updateView = () => setView(getViewFromUrl());
    window.addEventListener("popstate", updateView);
    // Next.js router.push triggers popstate, but also check on interval as fallback
    const interval = setInterval(updateView, 1000);
    return () => {
      window.removeEventListener("popstate", updateView);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!customer) return;

    setLoading(true);
    setError(null);

    fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: customer.id, view }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to generate summary");
        const data = await res.json();
        setSummary(data.summary);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [customer, view]);

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-gray-100 dark:bg-[#262633] rounded w-full" />
          <div className="h-4 bg-gray-100 dark:bg-[#262633] rounded w-5/6" />
          <div className="h-4 bg-gray-100 dark:bg-[#262633] rounded w-4/6" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {summary}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Powered by watsonx.ai
          </p>
        </>
      )}
    </div>
  );
}
