import { NextResponse } from "next/server";

const isAllowedTarget = (target: URL): boolean => {
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url") || "";

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!isAllowedTarget(target)) {
    return NextResponse.json(
      {
        error:
          "Blocked by server: localhost and private IP addresses are not allowed for security reasons.",
        host: target.hostname,
      },
      { status: 400 }
    );
  }

  // Pass through Range requests so PDF.js can do partial loading.
  const range = req.headers.get("range") || undefined;

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), {
      headers: range ? { range } : undefined,
      // Keep it simple; we only need binary.
      redirect: "follow",
    });
  } catch {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: "Upstream responded with error", status: upstream.status },
      { status: 502 }
    );
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "application/pdf");
  headers.set("Accept-Ranges", "bytes");

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  // These help PDF.js and avoid caching surprises for signed URLs.
  headers.set("Cache-Control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
