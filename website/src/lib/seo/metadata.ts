import type { Metadata } from "next";
import { DEFAULT_OG_ALT, DEFAULT_OG_IMAGE, SEO_TITLE_SUFFIX, absoluteUrl } from "@/lib/seo/url";
import { resolvedSeoTitle, type PublicSeoPage } from "@/lib/seo/pages";

export type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  image?: string | { url: string; alt: string };
  imageAlt?: string;
  index?: boolean;
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

function imageFrom(input: PageMetadataInput): { url: string; alt: string } {
  if (typeof input.image === "object" && input.image) {
    return { url: absoluteUrl(input.image.url), alt: input.image.alt || input.title };
  }
  if (typeof input.image === "string" && input.image.length > 0) {
    return { url: absoluteUrl(input.image), alt: input.imageAlt || input.title };
  }
  return { url: absoluteUrl(DEFAULT_OG_IMAGE), alt: DEFAULT_OG_ALT };
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const index = input.index ?? true;
  const resolvedTitle = resolvedSeoTitle(input);
  const canonical = absoluteUrl(input.canonical ?? input.path);
  const image = imageFrom(input);
  const robots = index ? { index: true, follow: true } : { index: false, follow: false };

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: resolvedTitle,
      description: input.description,
      url: canonical,
      siteName: "Renaatus",
      locale: "en_IN",
      type: input.type ?? "website",
      images: [{ url: image.url, alt: image.alt }],
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
            authors: input.authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: input.description,
      images: [image.url],
    },
  };
}

export function pageMetadataFromSeo(page: PublicSeoPage): Metadata {
  return pageMetadata({
    path: page.path,
    title: page.title,
    description: page.description,
    absoluteTitle: page.absoluteTitle,
    image: page.image,
    imageAlt: page.imageAlt,
    index: page.index,
  });
}

export { SEO_TITLE_SUFFIX };
