import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const upstreamUrl =
      process.env.MLVOCA_API_URL ||
      process.env.NEXT_PUBLIC_MLVOCA_API_URL ||
      "https://mlvoca.com/api/generate";

    const upstreamRes = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Avoid caching proxy responses.
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
      { error: "mlvoca proxy failed", message },
      { status: 500 }
    );
  }
}
