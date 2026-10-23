import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function guardRate(key: string, limit: number, windowMs: number) {
  const result = rateLimit(key, limit, windowMs);
  return result.ok ? null : rateLimited(result.retryAfter);
}

/** Reject cross-site form posts. Browsers send Origin on same-origin POSTs. */
export function rateLimited(retryAfter: number) {
  const res = json({ error: "rate_limited", retryAfter }, 429);
  res.headers.set("Retry-After", String(retryAfter));
  return res;
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 8;
