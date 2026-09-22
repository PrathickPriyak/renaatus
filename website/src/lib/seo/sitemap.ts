import type { MetadataRoute } from "next";
import type { PrismaClient } from "../../../generated/prisma/client";
import { catalogProjects, products } from "@/lib/catalog";
import { indexableSeoPages } from "@/lib/seo/pages";
import { absoluteUrl } from "@/lib/seo/url";

function sitemapPath(path: string): string {
  if (path === "/") {
    return `${absoluteUrl("/")}/`;
  }
  return absoluteUrl(path);
}

export async function buildSitemap(db: PrismaClient): Promise<MetadataRoute.Sitemap> {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true, publishedAt: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });

  const staticEntries: MetadataRoute.Sitemap = indexableSeoPages.map((page) => ({
    url: sitemapPath(page.path),
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = catalogProjects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...productEntries, ...blogEntries];
}
