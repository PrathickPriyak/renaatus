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

  it("refuses to publish the unused 5 GB dump, fonts, icons, and loop videos", () => {
    assert.equal(isDeniedPublicAsset("fonts/fa-solid-900.woff2"), true);
    assert.equal(isDeniedPublicAsset("icons/stat-r1.png"), true);
    assert.equal(isDeniedPublicAsset("documents/brand-pack.pdf"), true);
    assert.equal(isDeniedPublicAsset("videos/loading.mp4"), true);
    assert.equal(isDeniedPublicAsset("videos/about-loop.mp4"), true);
    assert.equal(isDeniedPublicAsset("videos/hero-mobile.mp4"), true);

    assert.equal(
      shouldPublishAsset("videos/hero-mobile.mp4", ["videos/hero-mobile.mp4"]),
      false,
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
