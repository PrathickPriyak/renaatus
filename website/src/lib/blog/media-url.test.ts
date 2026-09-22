import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { publicMediaDisplayUrl } from "@/lib/blog/media-url";

describe("publicMediaDisplayUrl", () => {
  const originalBase = process.env.R2_PUBLIC_BASE_URL;

  afterEach(() => {
    if (originalBase === undefined) {
      delete process.env.R2_PUBLIC_BASE_URL;
    } else {
      process.env.R2_PUBLIC_BASE_URL = originalBase;
    }
  });

  it("returns null for private media", () => {
    delete process.env.R2_PUBLIC_BASE_URL;
    assert.equal(
      publicMediaDisplayUrl({
        visibility: "PRIVATE",
        key: "resumes/secret.pdf",
        bucket: "local-private",
      }),
      null,
    );
  });

  it("maps local-public image keys to /assets paths", () => {
    delete process.env.R2_PUBLIC_BASE_URL;
    assert.equal(
      publicMediaDisplayUrl({
        visibility: "PUBLIC",
        key: "images/news/cmrl-tower.png",
        bucket: "local-public",
      }),
      "/assets/images/news/cmrl-tower.png",
    );
  });

  it("prefers the configured public object-storage base URL", () => {
    process.env.R2_PUBLIC_BASE_URL = "https://cdn.example.com/media/";
    assert.equal(
      publicMediaDisplayUrl({
        visibility: "PUBLIC",
        key: "images/news/sap-live.jpg",
        bucket: "public",
      }),
      "https://cdn.example.com/media/images/news/sap-live.jpg",
    );
  });
});
