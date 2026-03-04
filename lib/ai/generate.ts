import type { ViewType } from "@/types";
import { getAiConfig } from "./config";
import { watsonxChat } from "./watsonx";
import { mockGenerateSummary, mockGenerateChat } from "./mock";
import { buildSummaryMessages, buildChatMessages } from "./prompts";
import type { ChatMessage } from "./prompts";
import { gatherContext } from "./gather-context";

const summaryCache = new Map<string, { text: string; expiresAt: number }>();
const SUMMARY_CACHE_TTL = 5 * 60 * 1000;

export async function generateSummary(customerId: string, view: ViewType): Promise<string> {
  const cacheKey = `${customerId}|${view}`;
  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.text;
  }

  const config = getAiConfig();

  if (config.provider === "mock") {
    const text = mockGenerateSummary(view);
    summaryCache.set(cacheKey, { text, expiresAt: Date.now() + SUMMARY_CACHE_TTL });
    return text;
  }

  const context = await gatherContext(customerId, view);
  const messages = buildSummaryMessages(view, context);
  const text = await watsonxChat(messages, 250);

  summaryCache.set(cacheKey, { text, expiresAt: Date.now() + SUMMARY_CACHE_TTL });
  return text;
}

export async function generateChatResponse(
  customerId: string,
  view: ViewType,
  question: string,
  history: ChatMessage[],
): Promise<string> {
  const config = getAiConfig();

  if (config.provider === "mock") {
    return mockGenerateChat(question);
  }

  const context = await gatherContext(customerId, view);
  const messages = buildChatMessages(view, context, question, history);
  return watsonxChat(messages, 300);
}
