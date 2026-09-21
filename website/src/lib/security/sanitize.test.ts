import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizePlainText } from "@/lib/security/sanitize";

describe("sanitizePlainText", () => {
  it("strips HTML and script payloads", () => {
    const cleaned = sanitizePlainText(
      '<script>alert("xss")</script>Priya<img src=x onerror=alert(1)>',
    );
    assert.equal(cleaned.includes("<"), false);
    assert.equal(cleaned.includes("script"), false);
    assert.match(cleaned, /Priya/);
  });

  it("removes null bytes and control characters", () => {
    const cleaned = sanitizePlainText("Priya\0\u0007 Natarajan");
    assert.equal(cleaned, "Priya Natarajan");
  });

  it("trims and collapses whitespace on single-line fields", () => {
    const cleaned = sanitizePlainText("  Priya   \n  Natarajan  ");
    assert.equal(cleaned, "Priya Natarajan");
  });

  it("keeps paragraph breaks on multiline fields", () => {
    const cleaned = sanitizePlainText("Hello\n\nWe are looking for AAC blocks.", {
      multiline: true,
    });
    assert.match(cleaned, /Hello\n\nWe are looking/);
  });
});
