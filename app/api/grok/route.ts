import { NextResponse } from "next/server";

const REALISTIC_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function POST(req: Request) {
  try {
    const key = process.env.GROK_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing GROK_API_KEY" },
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

    const upstreamUrl = "https://api.x.ai/v1/chat/completions";

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
