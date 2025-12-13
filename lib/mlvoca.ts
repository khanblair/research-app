// mlvoca.com Free LLM API integration
// Documentation: https://mlvoca.github.io/free-llm-api/

// In the browser, call our same-origin proxy to avoid CORS issues.
// On the server, we can call mlvoca.com directly.
const MLVOCA_PROXY_PATH = "/api/mlvoca";
const MLVOCA_DIRECT_URL =
  process.env.NEXT_PUBLIC_MLVOCA_API_URL || "https://mlvoca.com/api/generate";

export interface MlvocaGenerateOptions {
  model: string; // "tinyllama" or "deepseek-r1:1.5b"
  prompt: string;
  stream?: boolean;
  suffix?: string;
  format?: string;
  system?: string;
  template?: string;
  raw?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    [key: string]: any;
  };
}

export interface MlvocaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Generate text using mlvoca.com Free LLM API
 * @param options - Generation options
 * @returns The full response text
 */
export async function generateWithMlvoca(options: MlvocaGenerateOptions): Promise<string> {
  const requestBody: MlvocaGenerateOptions = {
    model: options.model,
    prompt: options.prompt,
    stream: false, // We'll use non-streaming for simplicity
    options: {
      temperature: options.options?.temperature ?? 0.7,
      ...(options.options || {}),
    },
  };

  if (options.system) requestBody.system = options.system;
  if (options.suffix) requestBody.suffix = options.suffix;
  if (options.format) requestBody.format = options.format;

  try {
    const url = typeof window === "undefined" ? MLVOCA_DIRECT_URL : MLVOCA_PROXY_PATH;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`mlvoca API error (${response.status}): ${errorText}`);
    }

    const data: MlvocaResponse = await response.json();
    
    if (!data.response) {
      throw new Error("Empty response from mlvoca API");
    }

    return data.response;
  } catch (error: any) {
    console.error("mlvoca API error:", error);
    throw new Error(`Failed to generate with mlvoca: ${error.message}`);
  }
}

/**
 * Convert chat messages format to mlvoca prompt
 * mlvoca uses a simple prompt-based API, so we need to convert chat messages
 */
export function convertChatMessagesToPrompt(
  messages: Array<{ role: string; content: string }>
): { prompt: string; system?: string } {
  let systemMessage: string | undefined;
  const conversationParts: string[] = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      systemMessage = msg.content;
    } else if (msg.role === "user") {
      conversationParts.push(`User: ${msg.content}`);
    } else if (msg.role === "assistant") {
      conversationParts.push(`Assistant: ${msg.content}`);
    }
  }

  // Add a trailing "Assistant:" to prompt the model to respond
  conversationParts.push("Assistant:");

  return {
    prompt: conversationParts.join("\n\n"),
    system: systemMessage,
  };
}
