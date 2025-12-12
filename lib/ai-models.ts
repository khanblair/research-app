// AI model options available through Puter.js
export const AI_MODELS = [
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    description: "Most capable, best for complex tasks",
    provider: "Anthropic",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Balanced performance and speed",
    provider: "Anthropic",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Fast and capable OpenAI model",
    provider: "OpenAI",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "OpenAI's flagship model",
    provider: "OpenAI",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective",
    provider: "OpenAI",
  },
] as const;

export type AIModelId = typeof AI_MODELS[number]["id"];

export const getModelById = (id: string) => {
  return AI_MODELS.find((m) => m.id === id) || AI_MODELS[0];
};
