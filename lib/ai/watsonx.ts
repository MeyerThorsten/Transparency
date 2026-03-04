import { getIamToken } from "./token";
import { getAiConfig } from "./config";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface WatsonxChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function watsonxChat(messages: ChatMessage[], maxTokens?: number): Promise<string> {
  const config = getAiConfig();
  const token = await getIamToken(config.watsonx.apiKey);

  const url = `https://${config.watsonx.region}.ml.cloud.ibm.com/ml/v1/text/chat?version=2025-02-06`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      model_id: config.watsonx.modelId,
      project_id: config.watsonx.projectId,
      messages,
      max_tokens: maxTokens ?? 300,
      temperature: 0.3,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`watsonx.ai chat failed (${response.status}): ${text}`);
  }

  const data: WatsonxChatResponse = await response.json();
  return data.choices[0]?.message?.content?.trim() ?? "";
}
