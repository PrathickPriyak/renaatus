import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  IMAGE_OPTIMIZATION_CACHE_TTL_SECONDS,
  MARKETING_REVALIDATE_SECONDS,
  PUBLIC_ASSET_CACHE_CONTROL,
  SITEMAP_REVALIDATE_SECONDS,
} from "@/lib/performance/cache-headers";

describe("performance cache policy", () => {
  it("gives brand assets a day-long public cache without immutable hashing", () => {
    assert.equal(PUBLIC_ASSET_CACHE_CONTROL.includes("public"), true);
    assert.equal(PUBLIC_ASSET_CACHE_CONTROL.includes("max-age=86400"), true);
    assert.equal(PUBLIC_ASSET_CACHE_CONTROL.includes("immutable"), false);
    assert.ok(IMAGE_OPTIMIZATION_CACHE_TTL_SECONDS >= 60 * 60 * 24 * 7);
  });

  it("revalidates marketing and sitemap data on a timer instead of every request", () => {
    assert.equal(MARKETING_REVALIDATE_SECONDS, 300);
    assert.equal(SITEMAP_REVALIDATE_SECONDS, 3600);
  });
});
