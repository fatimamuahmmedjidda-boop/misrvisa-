import { NextResponse } from "next/server";

// Per-instance sliding-window limiter. On Vercel each serverless instance keeps
// its own window, so this slows brute force and form spam rather than acting as
// a global quota — pair it with a Vercel Firewall rate-limit rule for that.
const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
}

/**
 * Rejects cross-site POSTs and requests over `limit` per `windowMs` for this IP.
 * Returns a response to send back, or null when the request may continue.
 */
export function guardRequest(request: Request, bucket: string, limit: number, windowMs: number): NextResponse | null {
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  }

  const key = `${bucket}:${clientIp(request)}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return null;
}
