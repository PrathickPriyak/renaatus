import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError } from "@/lib/errors";
import { consumeLoginRateLimit, resetMemoryRateLimitStore } from "@/lib/security/rate-limit";

describe("production rate limiting", () => {
  it("fails closed in production without Upstash", async () => {
    const previousApp = process.env.APP_ENV;
    const previousUrl = process.env.UPSTASH_REDIS_REST_URL;
    const previousToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    const previousSecret = process.env.AUTH_SECRET;
    process.env.APP_ENV = "production";
    process.env.AUTH_SECRET = previousSecret || "test-auth-secret-for-rate-limit-32";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    resetMemoryRateLimitStore();

    try {
      await assert.rejects(
        () => consumeLoginRateLimit({ ip: "198.51.100.12" }),
        (error: unknown) => error instanceof AppError,
      );
    } finally {
      process.env.APP_ENV = previousApp;
      if (previousUrl === undefined) {
        delete process.env.UPSTASH_REDIS_REST_URL;
      } else {
        process.env.UPSTASH_REDIS_REST_URL = previousUrl;
      }
      if (previousToken === undefined) {
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
      } else {
        process.env.UPSTASH_REDIS_REST_TOKEN = previousToken;
      }
      if (previousSecret === undefined) {
        delete process.env.AUTH_SECRET;
      } else {
        process.env.AUTH_SECRET = previousSecret;
      }
    }
  });
});
