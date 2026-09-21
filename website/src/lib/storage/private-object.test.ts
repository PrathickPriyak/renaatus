import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, describe, it } from "node:test";
import { rm } from "node:fs/promises";
import path from "node:path";
import { AppError } from "@/lib/errors";
import { getPrivateObject, putPrivateObject } from "@/lib/storage/private-object";

const writtenKeys: string[] = [];

after(async () => {
  for (const key of writtenKeys) {
    await rm(path.join(process.cwd(), ".uploads", key), { force: true });
  }
});

describe("private object storage", () => {
  it("stores and reads bytes under a private key without a public URL", async () => {
    const key = `private/careers/2099/01/${randomUUID()}.pdf`;
    const body = new Uint8Array(Buffer.from("%PDF-1.4 stored"));
    const stored = await putPrivateObject({
      key,
      body,
      mimeType: "application/pdf",
    });
    writtenKeys.push(key);

    assert.equal(stored.key, key);
    assert.equal("url" in stored, false);
    assert.match(stored.bucket, /./);

    const loaded = await getPrivateObject(key);
    assert.ok(loaded);
    assert.deepEqual(loaded.body, body);
  });

  it("refuses keys outside the private prefix", async () => {
    await assert.rejects(
      () =>
        putPrivateObject({
          key: "public/careers/cv.pdf",
          body: new Uint8Array([1, 2, 3]),
          mimeType: "application/pdf",
        }),
      (error: unknown) => error instanceof AppError,
    );
    await assert.rejects(
      () => getPrivateObject("public/careers/cv.pdf"),
      (error: unknown) => error instanceof AppError,
    );
  });

  it("refuses path traversal in object keys", async () => {
    await assert.rejects(
      () =>
        putPrivateObject({
          key: "private/careers/../../../etc/passwd",
          body: new Uint8Array([1]),
          mimeType: "application/pdf",
        }),
      (error: unknown) => error instanceof AppError,
    );
  });

  it("returns null for a missing private object", async () => {
    const loaded = await getPrivateObject(`private/careers/2099/01/${randomUUID()}.pdf`);
    assert.equal(loaded, null);
  });
});
