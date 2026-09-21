import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ValidationError } from "@/lib/errors";
import {
  buildResumeObjectKey,
  sanitizeResumeFilename,
  validateResumeUpload,
} from "@/lib/enquiry/resume";

function pdfBytes(size = 64): Uint8Array {
  const bytes = new Uint8Array(size);
  const header = Buffer.from("%PDF-1.4");
  bytes.set(header, 0);
  return bytes;
}

describe("validateResumeUpload", () => {
  it("accepts a modest PDF resume", () => {
    const result = validateResumeUpload({
      filename: "Priya Natarajan.pdf",
      mimeType: "application/pdf",
      byteSize: 64,
      bytes: pdfBytes(),
    });
    assert.equal(result.extension, "pdf");
    assert.equal(result.mimeType, "application/pdf");
  });

  it("rejects an oversized resume", () => {
    assert.throws(
      () =>
        validateResumeUpload({
          filename: "cv.pdf",
          mimeType: "application/pdf",
          byteSize: 6 * 1024 * 1024,
          bytes: pdfBytes(),
        }),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it("rejects executable files even with a pdf name", () => {
    const bytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]);
    assert.throws(
      () =>
        validateResumeUpload({
          filename: "cv.pdf",
          mimeType: "application/pdf",
          byteSize: bytes.byteLength,
          bytes,
        }),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it("rejects a missing file", () => {
    assert.throws(
      () => validateResumeUpload(null),
      (error: unknown) => error instanceof ValidationError,
    );
  });
});

describe("resume object keys", () => {
  it("builds a private randomised careers key", () => {
    const key = buildResumeObjectKey("pdf");
    assert.match(key, /^private\/careers\/\d{4}\/\d{2}\/[a-z0-9-]+\.pdf$/);
  });

  it("sanitizes uploaded filenames", () => {
    const filename = sanitizeResumeFilename("../../etc/passwd.pdf");
    assert.equal(filename.includes(".."), false);
    assert.equal(filename.endsWith(".pdf"), true);
  });
});
