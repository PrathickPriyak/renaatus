import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { buildSitemap } from "@/lib/seo/sitemap";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(getDb());
}
