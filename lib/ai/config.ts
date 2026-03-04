export type AiProvider = "mock" | "watsonx";

export interface AiConfig {
  provider: AiProvider;
  watsonx: {
    apiKey: string;
    projectId: string;
    region: string;
    modelId: string;
  };
}

export function getAiConfig(): AiConfig {
  const provider = (process.env.AI_PROVIDER as AiProvider) || "mock";
  return {
    provider,
    watsonx: {
      apiKey: process.env.WATSONX_API_KEY || "",
      projectId: process.env.WATSONX_PROJECT_ID || "",
      region: process.env.WATSONX_REGION || "us-south",
      modelId: process.env.WATSONX_MODEL_ID || "ibm/granite-4-h-small",
    },
  };
}

export function validateAiConfig(config: AiConfig): string[] {
  const errors: string[] = [];
  if (config.provider === "watsonx") {
    if (!config.watsonx.apiKey) errors.push("WATSONX_API_KEY is required");
    if (!config.watsonx.projectId) errors.push("WATSONX_PROJECT_ID is required");
  }
  return errors;
}
