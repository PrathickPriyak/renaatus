import { siteConfig } from "@/lib/site";

export const DEFAULT_OG_IMAGE = "/assets/images/banners/infrastructure.jpg";
export const DEFAULT_OG_ALT = "Renaatus infrastructure and luxury residences";
export const SEO_TITLE_SUFFIX = " | Renaatus";

export function absoluteUrl(path = "/"): string {
  const origin = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") {
    return origin;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
