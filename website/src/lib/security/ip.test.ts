import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError } from "@/lib/errors";
import { hashClientIp, readClientIp } from "@/lib/security/ip";

describe("client IP", () => {
  it("does not trust a client-supplied X-Forwarded-For hop", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 198.51.100.8",
      "x-vercel-forwarded-for": "198.51.100.8",
      "x-real-ip": "198.51.100.8",
    });

    assert.equal(readClientIp(headers), "198.51.100.8");
  });

  it("uses the trusted platform IP when X-Forwarded-For is spoofed alone", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1",
      "x-real-ip": "198.51.100.9",
    });

    assert.equal(readClientIp(headers), "198.51.100.9");
  });

  it("refuses to hash IPs without AUTH_SECRET", () => {
    const previous = process.env.AUTH_SECRET;
    delete process.env.AUTH_SECRET;
    try {
      assert.throws(() => hashClientIp("198.51.100.10"), AppError);
    } finally {
      if (previous === undefined) {
        delete process.env.AUTH_SECRET;
      } else {
        process.env.AUTH_SECRET = previous;
      }
    }
  });
});
