import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/url";

export const PRIVATE_ROBOTS_HEADER_VALUE = "noindex, nofollow";

export function buildRobots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/login",
        "/api/",
        "/private",
        "/private/",
        "/design-system",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
