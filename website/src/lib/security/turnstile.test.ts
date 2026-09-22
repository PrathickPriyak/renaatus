import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError } from "@/lib/errors";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

describe("Turnstile", () => {
  it("fails closed in production when the secret is missing", async () => {
    const previousApp = process.env.APP_ENV;
    const previousSecret = process.env.TURNSTILE_SECRET_KEY;
    process.env.APP_ENV = "production";
    delete process.env.TURNSTILE_SECRET_KEY;

    try {
      await assert.rejects(
        () => verifyTurnstileToken({ token: "token", ip: "198.51.100.11" }),
        (error: unknown) => error instanceof AppError,
      );
    } finally {
      process.env.APP_ENV = previousApp;
      if (previousSecret === undefined) {
        delete process.env.TURNSTILE_SECRET_KEY;
      } else {
        process.env.TURNSTILE_SECRET_KEY = previousSecret;
      }
    }
  });
});
