import type { AiInsightsResponse } from "@/types";
import { getAiConfig } from "./config";
import { watsonxChat } from "./watsonx";
import { mockGenerateInsights } from "./mock-insights";
import { buildInsightsMessages } from "./insights-prompts";
import { gatherInsightsContext } from "./gather-insights-context";
import { parseInsightsResponse } from "./parse-insights";

const insightsCache = new Map<string, { data: AiInsightsResponse; expiresAt: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export async function generateInsights(customerId: string): Promise<AiInsightsResponse> {
  const cached = insightsCache.get(customerId);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const config = getAiConfig();

  if (config.provider === "mock") {
    const data = mockGenerateInsights();
    insightsCache.set(customerId, { data, expiresAt: Date.now() + CACHE_TTL });
    return data;
  }

  const context = await gatherInsightsContext(customerId);
  const messages = buildInsightsMessages(context);
  const raw = await watsonxChat(messages, 350);
  const data = parseInsightsResponse(raw);

  insightsCache.set(customerId, { data, expiresAt: Date.now() + CACHE_TTL });
  return data;
}
