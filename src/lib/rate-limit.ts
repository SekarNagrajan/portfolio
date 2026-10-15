import "server-only";

/**
 * In-memory sliding-window rate limiter.
 *
 * Good enough for a single server instance (and for Vercel, where each
 * warm function instance keeps its own window — a soft limit). If the
 * site moves to multiple long-lived instances, swap the Map for a shared
 * store such as Upstash Redis / Vercel KV behind the same interface.
 */
type Window = { hits: number[] };

const buckets = new Map<string, Window>();
const MAX_KEYS = 5_000;

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    const retryAfterMs = windowMs - (now - bucket.hits[0]);
    return { ok: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  // Bound memory: drop the oldest keys once the map grows large.
  if (buckets.size > MAX_KEYS) {
    const overflow = buckets.size - MAX_KEYS;
    let i = 0;
    for (const k of buckets.keys()) {
      if (i++ >= overflow) break;
      buckets.delete(k);
    }
  }

  return { ok: true, remaining: limit - bucket.hits.length };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(h: Headers): string {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}
