import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HERO_DESKTOP_VIDEO,
  HERO_MOBILE_MAX_WIDTH,
  heroPosterPriority,
  heroVideoPreload,
  shouldAttachHeroVideoSource,
  shouldAutoplayHeroVideo,
} from "@/lib/performance/hero-media";

describe("hero media policy", () => {
  it("does not autoplay the large hero video on mobile", () => {
    assert.equal(
      shouldAutoplayHeroVideo({ reducedMotion: false, isMobile: true }),
      false,
    );
  });

  it("does not autoplay when the visitor prefers reduced motion", () => {
    assert.equal(
      shouldAutoplayHeroVideo({ reducedMotion: true, isMobile: false }),
      false,
    );
  });

  it("autoplays a muted desktop hero only after the section is needed", () => {
    assert.equal(
      shouldAutoplayHeroVideo({ reducedMotion: false, isMobile: false }),
      true,
    );
    assert.equal(
      shouldAttachHeroVideoSource({ autoplay: true, inView: false }),
      false,
    );
    assert.equal(
      shouldAttachHeroVideoSource({ autoplay: true, inView: true }),
      true,
    );
    assert.equal(heroVideoPreload(false), "none");
    assert.equal(heroVideoPreload(true), "metadata");
  });

  it("prioritises only the visible poster breakpoint", () => {
    assert.equal(heroPosterPriority({ isMobile: true, variant: "mobile" }), true);
    assert.equal(heroPosterPriority({ isMobile: true, variant: "desktop" }), false);
    assert.equal(heroPosterPriority({ isMobile: false, variant: "desktop" }), true);
    assert.equal(heroPosterPriority({ isMobile: false, variant: "mobile" }), false);
    assert.equal(HERO_MOBILE_MAX_WIDTH, 767);
    assert.equal(HERO_DESKTOP_VIDEO.endsWith("hero-desktop.mp4"), true);
  });
});
