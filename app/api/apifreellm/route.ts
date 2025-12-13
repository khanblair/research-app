import { NextResponse } from "next/server";

const REALISTIC_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const upstreamUrl = "https://apifreellm.com/api/chat";

    const upstreamRes = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Cloudflare WAF protection: include realistic User-Agent.
        "User-Agent": REALISTIC_UA,
      },
      body: JSON.stringify(body),
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
      { status: "error", error: "ApiFreeLLM proxy failed", message },
      { status: 500 }
    );
  }
}
