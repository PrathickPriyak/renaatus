export const HERO_MOBILE_MAX_WIDTH = 767;
export const HERO_IMAGE_QUALITY = 85;

export const HERO_DESKTOP_POSTER = "/assets/images/realty/maldives/irumathi-exterior.png";
export const HERO_MOBILE_POSTER = "/assets/images/realty/maldives/irumathi-exterior.png";
export const HERO_DESKTOP_VIDEO = "/assets/videos/hero-desktop.mp4";

/**
 * Desktop hero uses a clean photography still. The branded loop video embeds
 * on-screen kit typography ("5 Elements…") that collides with page copy, so it
 * stays available as an asset but is not autoplayed on the marketing hero.
 */
export function shouldAutoplayHeroVideo(input: {
  reducedMotion: boolean;
  isMobile: boolean;
}): boolean {
  void input;
  return false;
}

export function shouldAttachHeroVideoSource(input: {
  autoplay: boolean;
  inView: boolean;
}): boolean {
  return input.autoplay && input.inView;
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
