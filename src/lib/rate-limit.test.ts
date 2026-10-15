import { afterEach, describe, expect, it, vi } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit and then blocks", () => {
    const key = "test-allow";
    const opts = { limit: 2, windowMs: 60_000 };
    expect(rateLimit(key, opts)).toEqual({ ok: true, remaining: 1 });
    expect(rateLimit(key, opts)).toEqual({ ok: true, remaining: 0 });
    const blocked = rateLimit(key, opts);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("allows another request after the window expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const key = "test-window";
    const opts = { limit: 1, windowMs: 1_000 };
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect(rateLimit(key, opts).ok).toBe(true);
  });
});
