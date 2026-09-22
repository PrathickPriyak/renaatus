import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HERO_DESKTOP_VIDEO,
  HERO_MOBILE_MAX_WIDTH,
  HERO_MOBILE_VIDEO,
  heroPosterPriority,
  heroVideoPreload,
  heroVideoSrc,
  shouldAttachHeroVideoSource,
  shouldAutoplayHeroVideo,
} from "@/lib/performance/hero-media";

describe("hero media policy", () => {
  it("autoplays the branded hero loop on mobile when motion is allowed", () => {
    assert.equal(
      shouldAutoplayHeroVideo({ reducedMotion: false, isMobile: true }),
      true,
    );
    assert.equal(heroVideoSrc(true), HERO_MOBILE_VIDEO);
  });

  it("does not autoplay when the visitor prefers reduced motion", () => {
    assert.equal(
      shouldAutoplayHeroVideo({ reducedMotion: true, isMobile: false }),
      false,
    );
  });

  it("autoplays the branded hero loop on desktop", () => {
    assert.equal(
      shouldAutoplayHeroVideo({ reducedMotion: false, isMobile: false }),
      true,
    );
    assert.equal(
      shouldAttachHeroVideoSource({ autoplay: true, inView: true }),
      true,
    );
    assert.equal(
      shouldAttachHeroVideoSource({ autoplay: false, inView: true }),
      false,
    );
    assert.equal(heroVideoPreload(false), "none");
    assert.equal(heroVideoPreload(true), "metadata");
    assert.equal(heroVideoSrc(false), HERO_DESKTOP_VIDEO);
  });

  it("prioritises only the visible poster breakpoint", () => {
    assert.equal(heroPosterPriority({ isMobile: true, variant: "mobile" }), true);
    assert.equal(heroPosterPriority({ isMobile: true, variant: "desktop" }), false);
    assert.equal(heroPosterPriority({ isMobile: false, variant: "desktop" }), true);
    assert.equal(heroPosterPriority({ isMobile: false, variant: "mobile" }), false);
    assert.equal(HERO_MOBILE_MAX_WIDTH, 767);
    assert.equal(HERO_DESKTOP_VIDEO.endsWith("hero-desktop.mp4"), true);
    assert.equal(HERO_MOBILE_VIDEO.endsWith("hero-mobile.mp4"), true);
  });
});
