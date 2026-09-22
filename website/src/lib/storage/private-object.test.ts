import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, describe, it } from "node:test";
import { access, rm } from "node:fs/promises";
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

  it("fails closed in production when R2 is not configured", async () => {
    const previousEnv = process.env.APP_ENV;
    process.env.APP_ENV = "production";
    delete process.env.R2_ACCOUNT_ID;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
    delete process.env.R2_BUCKET_PRIVATE;

    try {
      await assert.rejects(
        () =>
          putPrivateObject({
            key: `private/careers/2099/01/${randomUUID()}.pdf`,
            body: new Uint8Array([1, 2, 3]),
            mimeType: "application/pdf",
          }),
        (error: unknown) => error instanceof AppError && error.code === "STORAGE_UNAVAILABLE",
      );
    } finally {
      if (previousEnv === undefined) {
        delete process.env.APP_ENV;
      } else {
        process.env.APP_ENV = previousEnv;
      }
    }
  });

  it("fails closed when NODE_ENV is production and APP_ENV is unset without R2", async () => {
    const previousApp = process.env.APP_ENV;
    const previousNode = process.env.NODE_ENV;
    delete process.env.APP_ENV;
    process.env.NODE_ENV = "production";
    delete process.env.R2_ACCOUNT_ID;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
    delete process.env.R2_BUCKET_PRIVATE;

    try {
      await assert.rejects(
        () =>
          putPrivateObject({
            key: `private/careers/2099/01/${randomUUID()}.pdf`,
            body: new Uint8Array([1, 2, 3]),
            mimeType: "application/pdf",
          }),
        (error: unknown) => error instanceof AppError && error.code === "STORAGE_UNAVAILABLE",
      );
    } finally {
      if (previousApp === undefined) {
        delete process.env.APP_ENV;
      } else {
        process.env.APP_ENV = previousApp;
      }
      process.env.NODE_ENV = previousNode;
    }
  });

  it("puts to R2 instead of local disk when private object storage is configured", async () => {
    const previous = {
      APP_ENV: process.env.APP_ENV,
      R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_PRIVATE: process.env.R2_BUCKET_PRIVATE,
    };
    const originalFetch = globalThis.fetch;
    const requests: Array<{ url: string; method: string }> = [];

    process.env.APP_ENV = "production";
    process.env.R2_ACCOUNT_ID = "test-account";
    process.env.R2_ACCESS_KEY_ID = "test-access";
    process.env.R2_SECRET_ACCESS_KEY = "test-secret";
    process.env.R2_BUCKET_PRIVATE = "renaatus-private";

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      requests.push({ url, method: init?.method ?? "GET" });
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const key = `private/careers/2099/01/${randomUUID()}.pdf`;
    try {
      const stored = await putPrivateObject({
        key,
        body: new Uint8Array(Buffer.from("%PDF-1.4 r2")),
        mimeType: "application/pdf",
      });
      assert.equal(stored.bucket, "renaatus-private");
      assert.equal(stored.key, key);
      assert.equal("url" in stored, false);
      assert.equal(requests.length, 1);
      assert.equal(requests[0]?.method, "PUT");
      assert.match(requests[0]?.url ?? "", /renaatus-private/);
      assert.match(requests[0]?.url ?? "", /test-account\.r2\.cloudflarestorage\.com/);

      await assert.rejects(
        () => access(path.join(process.cwd(), ".uploads", key)),
        (error: unknown) => (error as NodeJS.ErrnoException).code === "ENOENT",
      );
    } finally {
      globalThis.fetch = originalFetch;
      for (const [name, value] of Object.entries(previous)) {
        if (value === undefined) {
          delete process.env[name];
        } else {
          process.env[name] = value;
        }
      }
    }
  });
});
