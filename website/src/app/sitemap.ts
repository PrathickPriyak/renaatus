import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { buildSitemap } from "@/lib/seo/sitemap";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(getDb());
}
