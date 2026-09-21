import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, it } from "node:test";
import { rm } from "node:fs/promises";
import path from "node:path";
import { putPrivateObject } from "@/lib/storage/private-object";
import {
  loadPrivateDownload,
  signPrivateDownloadToken,
  verifyPrivateDownloadToken,
} from "@/lib/storage/private-download";

const SECRET = "test-auth-secret-for-private-downloads-32";
const writtenKeys: string[] = [];

before(() => {
  process.env.AUTH_SECRET = SECRET;
});

after(async () => {
  for (const key of writtenKeys) {
    await rm(path.join(process.cwd(), ".uploads", key), { force: true });
  }
});

describe("private download tokens", () => {
  it("round-trips a signed token bound to media id and key", () => {
    const mediaId = "media_123";
    const key = "private/careers/2026/09/abc.pdf";
    const token = signPrivateDownloadToken({
      mediaId,
      key,
      now: 1_000_000,
      ttlMs: 60_000,
      secret: SECRET,
    });

    const payload = verifyPrivateDownloadToken(token, { now: 1_000_000, secret: SECRET });
    assert.ok(payload);
    assert.equal(payload.mediaId, mediaId);
    assert.equal(payload.key, key);
    assert.equal(payload.exp, 1_060_000);
  });

  it("rejects unsigned, tampered, and expired tokens", () => {
    const token = signPrivateDownloadToken({
      mediaId: "media_123",
      key: "private/careers/2026/09/abc.pdf",
      now: 1_000_000,
      ttlMs: 1_000,
      secret: SECRET,
    });

    assert.equal(verifyPrivateDownloadToken("not-a-token", { secret: SECRET }), null);
    assert.equal(verifyPrivateDownloadToken(`${token}x`, { now: 1_000_000, secret: SECRET }), null);
    assert.equal(
      verifyPrivateDownloadToken(token, { now: 1_002_000, secret: SECRET }),
      null,
    );
    assert.equal(
      verifyPrivateDownloadToken(token, { now: 1_000_000, secret: "other-secret-value-32chars!!" }),
      null,
    );
  });

  it("loads a private object only when the token and media metadata match", async () => {
    const key = `private/careers/2099/01/${randomUUID()}.pdf`;
    const body = new Uint8Array(Buffer.from("%PDF-1.4 downloadable"));
    await putPrivateObject({ key, body, mimeType: "application/pdf" });
    writtenKeys.push(key);

    const mediaId = "media_private_1";
    const token = signPrivateDownloadToken({
      mediaId,
      key,
      secret: SECRET,
      now: Date.now(),
      ttlMs: 60_000,
    });

    const loaded = await loadPrivateDownload(token, {
      secret: SECRET,
      lookupMedia: async (id) => {
        if (id !== mediaId) {
          return null;
        }
        return {
          key,
          filename: "Priya-Natarajan.pdf",
          mimeType: "application/pdf",
          visibility: "PRIVATE",
        };
      },
    });

    assert.ok(loaded);
    assert.deepEqual(loaded.body, body);
    assert.equal(loaded.filename, "Priya-Natarajan.pdf");
    assert.equal(loaded.mimeType, "application/pdf");
  });

  it("does not load a public-visibility object even with a valid signature", async () => {
    const key = `private/careers/2099/01/${randomUUID()}.pdf`;
    const body = new Uint8Array(Buffer.from("%PDF-1.4"));
    await putPrivateObject({ key, body, mimeType: "application/pdf" });
    writtenKeys.push(key);

    const token = signPrivateDownloadToken({
      mediaId: "media_public",
      key,
      secret: SECRET,
    });

    const loaded = await loadPrivateDownload(token, {
      secret: SECRET,
      lookupMedia: async () => ({
        key,
        filename: "cv.pdf",
        mimeType: "application/pdf",
        visibility: "PUBLIC",
      }),
    });

    assert.equal(loaded, null);
  });
});
