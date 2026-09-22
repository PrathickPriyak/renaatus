import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractAssetKeysFromSource,
  isDeniedPublicAsset,
  shouldPublishAsset,
} from "@/lib/performance/public-assets";

describe("public asset publishing", () => {
  it("extracts local /assets paths from source", () => {
    const keys = extractAssetKeysFromSource(`
      src="/assets/images/banners/infrastructure.jpg"
      poster="/assets/videos/hero-desktop.mp4"
      ignore="https://cdn.example/assets/remote.jpg"
    `);
    assert.deepEqual(keys, [
      "images/banners/infrastructure.jpg",
      "videos/hero-desktop.mp4",
    ]);
  });

  it("extracts seed and CMS local-public media keys without an /assets prefix", () => {
    const keys = extractAssetKeysFromSource(`
      const sapImage = await db.media.upsert({
        where: { key: "images/news/sap-live.jpg" },
        create: { key: "images/news/sap-live.jpg", bucket: "local-public" },
      });
      const cover = { key: "images/verticals/aac-blocks.jpg" };
      const privateResume = { key: "resumes/applicant.pdf" };
      const font = { key: "fonts/fa-solid-900.woff2" };
    `);
    assert.deepEqual(keys, [
      "images/news/sap-live.jpg",
      "images/verticals/aac-blocks.jpg",
    ]);
  });

  it("refuses to publish fonts, icons, documents, and unused loop videos", () => {
    assert.equal(isDeniedPublicAsset("fonts/fa-solid-900.woff2"), true);
    assert.equal(isDeniedPublicAsset("icons/stat-r1.png"), true);
    assert.equal(isDeniedPublicAsset("documents/brand-pack.pdf"), true);
    assert.equal(isDeniedPublicAsset("videos/loading.mp4"), true);
    assert.equal(isDeniedPublicAsset("videos/about-loop.mp4"), true);
    assert.equal(isDeniedPublicAsset("videos/hero-mobile.mp4"), false);

    assert.equal(
      shouldPublishAsset("videos/hero-mobile.mp4", ["videos/hero-mobile.mp4"]),
      true,
    );
    assert.equal(
      shouldPublishAsset("videos/hero-desktop.mp4", ["videos/hero-desktop.mp4"]),
      true,
    );
    assert.equal(
      shouldPublishAsset("images/banners/infrastructure.jpg", [
        "images/banners/infrastructure.jpg",
      ]),
      true,
    );
  });
});
