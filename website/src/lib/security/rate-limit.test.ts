import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RateLimitError } from "@/lib/errors";
import {
  consumeMemoryRateLimit,
  resetMemoryRateLimitStore,
} from "@/lib/security/rate-limit";

describe("enquiry rate limit", () => {
  it("allows a small burst then rejects further attempts", async () => {
    resetMemoryRateLimitStore();
    const key = `test:${Date.now()}`;

    for (let index = 0; index < 5; index += 1) {
      await consumeMemoryRateLimit(key, { limit: 5, windowMs: 10 * 60 * 1000 });
    }

    await assert.rejects(
      () => consumeMemoryRateLimit(key, { limit: 5, windowMs: 10 * 60 * 1000 }),
      (error: unknown) => error instanceof RateLimitError,
    );
  });

  it("resets after the window elapses", async () => {
    resetMemoryRateLimitStore();
    let now = 1_000;
    const key = "window-reset";

    await consumeMemoryRateLimit(key, {
      limit: 1,
      windowMs: 1_000,
      now: () => now,
    });

    now = 2_100;
    await consumeMemoryRateLimit(key, {
      limit: 1,
      windowMs: 1_000,
      now: () => now,
    });
  });
});
