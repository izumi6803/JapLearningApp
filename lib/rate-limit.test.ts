import { describe, expect, it } from "vitest";
import { rateLimit } from "./rate-limit";

const key = () => `test-${Math.random().toString(36).slice(2)}`;

describe("rateLimit", () => {
  it("allows up to the limit, then blocks", () => {
    const k = key();
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);

    const blocked = rateLimit(k, 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("keeps independent keys separate", () => {
    const a = key();
    const b = key();
    expect(rateLimit(a, 1, 60_000).ok).toBe(true);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });

  it("resets after the window elapses", async () => {
    const k = key();
    expect(rateLimit(k, 1, 5).ok).toBe(true);
    expect(rateLimit(k, 1, 5).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 10));
    expect(rateLimit(k, 1, 5).ok).toBe(true);
  });
});
