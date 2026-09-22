export const HERO_MOBILE_MAX_WIDTH = 767;
export const HERO_IMAGE_QUALITY = 90;

/** First frames of the branded marketing loops — match LCP to the playing video. */
export const HERO_DESKTOP_POSTER = "/assets/images/hero/desktop-poster.jpg";
export const HERO_MOBILE_POSTER = "/assets/images/hero/mobile-poster.jpg";
export const HERO_DESKTOP_VIDEO = "/assets/videos/hero-desktop.mp4";
export const HERO_MOBILE_VIDEO = "/assets/videos/hero-mobile.mp4";

/**
 * Autoplay the branded hero loop whenever motion is allowed.
 * Kit typography is burned into the footage — page chrome stays in the
 * bottom safe zone so the video can own the center of the frame.
 */
export function shouldAutoplayHeroVideo(input: {
  reducedMotion: boolean;
  isMobile: boolean;
}): boolean {
  void input.isMobile;
  return !input.reducedMotion;
}

export function shouldAttachHeroVideoSource(input: {
  autoplay: boolean;
  inView: boolean;
}): boolean {
  return input.autoplay && input.inView;
}

export function heroVideoSrc(isMobile: boolean): string {
  return isMobile ? HERO_MOBILE_VIDEO : HERO_DESKTOP_VIDEO;
}

export function heroVideoPreload(attached: boolean): "none" | "metadata" {
  return attached ? "metadata" : "none";
}

export function heroPosterPriority(input: {
  isMobile: boolean;
  variant: "mobile" | "desktop";
}): boolean {
  return input.variant === "mobile" ? input.isMobile : !input.isMobile;
}
