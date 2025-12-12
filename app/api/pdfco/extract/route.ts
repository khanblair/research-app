import { NextResponse } from "next/server";

type PdfCoConvertResponse = {
  error?: boolean;
  message?: string;
  status?: number;
  body?: string;
  url?: string;
};

const isAllowedSourceUrl = (target: URL): boolean => {
  // Prevent SSRF: only allow http(s) and block localhost/private IPs.
  if (target.protocol !== "https:" && target.protocol !== "http:") return false;

  const host = target.hostname.toLowerCase();

  // Block localhost and loopback.
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return false;

  // Block private IP ranges (simple check).
  if (/^(10|127|172\.(1[6-9]|2[0-9]|3[01])|192\.168)\./.test(host)) return false;

  // Allow all other public http/https URLs.
  return true;
};

export async function POST(req: Request) {
  const apiKey = process.env.PDF_CO_API;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing PDF_CO_API in environment" },
      { status: 500 }
    );
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawUrl = (payload?.url || "").toString();
  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  // Keep this endpoint from becoming a public relay to internal services.
  if (!isAllowedSourceUrl(target)) {
    return NextResponse.json(
      {
        error:
          "Blocked by server: localhost and private IP addresses are not allowed for security reasons.",
        host: target.hostname,
      },
      { status: 400 }
    );
  }

  const lang = (payload?.lang || "eng").toString();
  const pages = payload?.pages ? payload.pages.toString() : undefined;

  const upstreamBody: Record<string, unknown> = {
    url: target.toString(),
    lang,
    inline: true,
    async: false,
  };
  if (pages) upstreamBody.pages = pages;

  let upstream: Response;
  try {
    upstream = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(upstreamBody),
    });
  } catch {
    return NextResponse.json({ error: "Failed to reach PDF.co" }, { status: 502 });
  }

  let data: PdfCoConvertResponse | null = null;
  try {
    data = (await upstream.json()) as PdfCoConvertResponse;
  } catch {
    // Some failures might not be JSON.
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: data?.message || `PDF.co request failed (${upstream.status})`,
        status: upstream.status,
      },
      { status: 502 }
    );
  }

  if (data?.error) {
    return NextResponse.json(
      { error: data.message || "PDF.co conversion failed" },
      { status: 502 }
    );
  }

  // PDF.co typically returns extracted text in `body` when inline=true.
  if (typeof data?.body === "string" && data.body.trim()) {
    return NextResponse.json({ text: data.body }, { status: 200 });
  }

  // Some PDF.co endpoints return a URL to the output file. Handle that too.
  if (typeof data?.url === "string" && data.url) {
    let out: Response;
    try {
      out = await fetch(data.url);
    } catch {
      return NextResponse.json(
        { error: "PDF.co returned an output URL but it could not be fetched" },
        { status: 502 }
      );
    }
    if (!out.ok) {
      return NextResponse.json(
        { error: `Failed to fetch PDF.co output (${out.status})` },
        { status: 502 }
      );
    }
    const text = await out.text();
    return NextResponse.json({ text }, { status: 200 });
  }

  return NextResponse.json(
    { error: "PDF.co returned no text" },
    { status: 502 }
  );
}
