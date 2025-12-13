// Grok (xAI) API integration via server-side proxy.
// Uses OpenAI-compatible chat completions.

export type GrokChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GrokChatOptions = {
  model: string;
  temperature?: number;
  max_tokens?: number;
};

type GrokChatCompletionsResponse = {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: Array<{
    index?: number;
    message?: { role?: string; content?: string };
    finish_reason?: string;
  }>;
  error?: { message?: string; type?: string; code?: string };
};

const GROK_PROXY_PATH = "/api/grok";

export async function generateWithGrokChat(
  messages: GrokChatMessage[],
  options: GrokChatOptions
): Promise<string> {
  const res = await fetch(GROK_PROXY_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ messages, ...options }),
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = /application\/json/i.test(contentType);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Grok proxy HTTP ${res.status}: ${text || res.statusText}`);
  }

  const data: GrokChatCompletionsResponse = isJson
    ? await res.json()
    : (() => {
        throw new Error(`Grok proxy non-JSON response: ${contentType || "unknown"}`);
      })();

  if (data.error?.message) throw new Error(data.error.message);

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Grok");
  return text;
}
