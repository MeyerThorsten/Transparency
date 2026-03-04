import type { ViewType } from "@/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const VIEW_AUDIENCES: Record<ViewType, string> = {
  "c-level": "C-level executive (CIO/CTO)",
  business: "business service manager",
  technical: "technical operations engineer",
};

export function buildSummaryMessages(view: ViewType, contextData: string): Array<{ role: "system" | "user"; content: string }> {
  const audience = VIEW_AUDIENCES[view];
  return [
    {
      role: "system",
      content: `You are an IT operations analyst for a managed services provider. Summarize dashboard data for a ${audience} in 3-4 sentences. Focus on what needs attention and any notable trends. Be specific with numbers. Do not use bullet points.`,
    },
    {
      role: "user",
      content: contextData,
    },
  ];
}

export function buildChatMessages(
  view: ViewType,
  contextData: string,
  question: string,
  history: ChatMessage[],
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const audience = VIEW_AUDIENCES[view];

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    {
      role: "system",
      content: `You are an AI assistant for an IT transparency portal. You are speaking to a ${audience}. Answer questions about the customer's infrastructure and services using ONLY the data provided in the first user message. If you cannot answer from the data, say so clearly. Keep answers concise (2-4 sentences). Be specific with numbers.`,
    },
    {
      role: "user",
      content: `Here is the current dashboard data:\n${contextData}`,
    },
  ];

  // Add conversation history (last 5 exchanges = 10 messages)
  for (const msg of history.slice(-10)) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // Add the current question
  messages.push({ role: "user", content: question });

  return messages;
}
