export const HERO_MOBILE_MAX_WIDTH = 767;
export const HERO_IMAGE_QUALITY = 85;

export const HERO_DESKTOP_POSTER = "/assets/images/banners/infrastructure.jpg";
export const HERO_MOBILE_POSTER = "/assets/images/realty/maldives/irumathi-exterior.png";
export const HERO_DESKTOP_VIDEO = "/assets/videos/hero-desktop.mp4";

export function shouldAutoplayHeroVideo(input: {
  reducedMotion: boolean;
  isMobile: boolean;
}): boolean {
  return !input.reducedMotion && !input.isMobile;
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
