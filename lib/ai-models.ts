// AI model options available through Puter.js and free providers
export const AI_MODELS = [
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B (Groq)",
    description: "Fast inference via Groq API",
    provider: "Groq",
  },
  {
    id: "apifreellm-free",
    name: "ApiFreeLLM (Free)",
    description: "Free model Llama/Qwen based",
    provider: "ApiFreeLLM.com (Free)",
  },
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    description: "Most best for complex tasks",
    provider: "Anthropic (Puter)",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Balanced performance and speed",
    provider: "Anthropic (Puter)",
  },
  {
    id: "claude-sonnet-3.5",
    name: "Claude Sonnet 3.5",
    description: "Reliable reasoning and writing",
    provider: "Anthropic (Puter)",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Fast and capable OpenAI model",
    provider: "OpenAI (Puter)",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "OpenAI's flagship model",
    provider: "OpenAI (Puter)",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective",
    provider: "OpenAI (Puter)",
  },
  {
    id: "deepseek-r1:1.5b",
    name: "DeepSeek R1 1.5B",
    description: "Free, fast reasoning model",
    provider: "mlvoca.com (Free)",
  },
  {
    id: "tinyllama",
    name: "TinyLlama",
    description: "Free, lightweight model",
    provider: "mlvoca.com (Free)",
  },
] as const;

export type AIModelId = typeof AI_MODELS[number]["id"];

// Project-wide default: ApiFreeLLM free endpoint (no key required).
export const DEFAULT_AI_MODEL_ID: AIModelId = "apifreellm-free";

export const isMlvocaModelId = (id: string) => {
  return id === "deepseek-r1:1.5b" || id === "tinyllama";
};

export const isApiFreeLlmModelId = (id: string) => {
  return id === "apifreellm-free";
};

export const isGrokModelId = (id: string) => {
  return id === "meta-llama/llama-4-scout-17b-16e-instruct";
};

// "Free" models (i.e., not Puter-backed).
export const isFreeModelId = (id: string) => {
  return isApiFreeLlmModelId(id) || isMlvocaModelId(id);
};

export const getModelById = (id: string) => {
  return (
    AI_MODELS.find((m) => m.id === id) ||
    AI_MODELS.find((m) => m.id === DEFAULT_AI_MODEL_ID) ||
    AI_MODELS[0]
  );
};
