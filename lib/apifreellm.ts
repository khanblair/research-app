// ApiFreeLLM.com Free API integration
// Docs: https://apifreellm.com/docs

export interface ApiFreeLlmResponse {
  status: "success" | "error";
  response?: string;
  error?: string;
}

const APIFREELLM_FREE_URL = "https://apifreellm.com/api/chat";
const APIFREELLM_PROXY_PATH = "/api/apifreellm";

const REALISTIC_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const isApiFreeLlmRateLimitMessage = (msg: string) => {
  return /rate limit exceeded/i.test(msg || "");
};

export const parseApiFreeLlmWaitSeconds = (msg: string): number | null => {
  const m = (msg || "").match(/wait\s+(\d+)\s*seconds?/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
};

export async function generateWithApiFreeLlm(message: string): Promise<string> {
  const body = JSON.stringify({ message });

  const doFetch = async (url: string, includeUA: boolean) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (includeUA) headers["User-Agent"] = REALISTIC_UA;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = /application\/json/i.test(contentType);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ApiFreeLLM HTTP ${res.status}: ${text || res.statusText}`);
    }

    const data: ApiFreeLlmResponse = isJson
      ? await res.json().catch(async () => {
          const text = await res.text();
          throw new Error(`ApiFreeLLM invalid JSON response: ${text}`);
        })
      : (() => {
          throw new Error(`ApiFreeLLM non-JSON response: ${contentType || "unknown"}`);
        })();

    if (data.status !== "success") {
      throw new Error(data.error || "ApiFreeLLM error");
    }

    if (!data.response) throw new Error("Empty response from ApiFreeLLM");
    return data.response;
  };

  try {
    // Prefer calling direct from the browser (keeps rate limit per-user IP).
    if (typeof window !== "undefined") {
      try {
        return await doFetch(APIFREELLM_FREE_URL, false);
      } catch (e: any) {
        // If the browser is blocked by CORS/network, fall back to same-origin proxy.
        const msg = e?.message || String(e);
        if (
          /failed to fetch/i.test(msg) ||
          /internal server error/i.test(msg) ||
          /cloudflare|forbidden|\b403\b/i.test(msg) ||
          /invalid json|non-json response/i.test(msg)
        ) {
          return await doFetch(APIFREELLM_PROXY_PATH, false);
        }
        throw e;
      }
    }

    // Server-side: include realistic User-Agent to avoid Cloudflare 403 blocks.
    return await doFetch(APIFREELLM_FREE_URL, true);
  } catch (error: any) {
    console.error("ApiFreeLLM API error:", error);
    throw new Error(`Failed to generate with ApiFreeLLM: ${error.message}`);
  }
}

// Convert multi-message chat into a single prompt string (ApiFreeLLM free API only accepts {message}).
export function convertChatMessagesToSingleMessage(
  messages: Array<{ role: string; content: string }>
): string {
  const parts: string[] = [];

  for (const msg of messages) {
    const role = (msg.role || "user").toLowerCase();
    if (role === "system") {
      parts.push(`System: ${msg.content}`);
    } else if (role === "user") {
      parts.push(`User: ${msg.content}`);
    } else if (role === "assistant") {
      parts.push(`Assistant: ${msg.content}`);
    } else {
      parts.push(`${msg.role}: ${msg.content}`);
    }
  }

  return parts.join("\n\n");
}
