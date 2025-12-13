import { NextResponse } from "next/server";

const REALISTIC_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function POST(req: Request) {
  try {
    // Groq keys come from https://console.groq.com and typically start with "gsk_".
    // Support both names to avoid breaking existing env.local setups.
    const key = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY (or GROK_API_KEY)" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, model, temperature, max_tokens } = body || {};

    if (!model || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request. Expected { model, messages[] }" },
        { status: 400 }
      );
    }

    // Groq exposes an OpenAI-compatible API surface.
    const upstreamUrl = "https://api.groq.com/openai/v1/chat/completions";

    const upstreamRes = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${key}`,
        "User-Agent": REALISTIC_UA,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: typeof temperature === "number" ? temperature : 0.7,
        max_tokens: typeof max_tokens === "number" ? max_tokens : 1000,
      }),
      cache: "no-store",
    });

    const text = await upstreamRes.text();

    return new NextResponse(text, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": upstreamRes.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    const message = error?.message || String(error);
    return NextResponse.json(
      { error: "Grok proxy failed", message },
      { status: 500 }
    );
  }
}
