import { offices, verticals } from "@/lib/content";
import { socialLinks } from "@/lib/navigation";
import type { CatalogProduct } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo/url";

export type JsonLdRecord = Record<string, unknown>;

function headquarters() {
  return offices.find((office) => office.role === "Headquarters") ?? offices[0];
}

export function organizationJsonLd(): JsonLdRecord {
  const hq = headquarters();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Renaatus",
    legalName: siteConfig.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/assets/logos/renaatus-logo-light.png"),
    email: hq?.email,
    telephone: hq?.phone,
    address: hq
      ? {
          "@type": "PostalAddress",
          streetAddress: hq.address,
          addressLocality: "Chennai",
          addressCountry: "IN",
        }
      : undefined,
    sameAs: socialLinks.map((link) => link.href),
    areaServed: ["IN", "MV", "MU"],
  };
}

export function websiteJsonLd(): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Renaatus",
    url: absoluteUrl("/"),
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Renaatus",
      legalName: siteConfig.legalName,
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ href: string; label: string }>,
): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export type ArticleJsonLdInput = {
  headline: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName: string;
};

export function articleJsonLd(input: ArticleJsonLdInput): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: input.url,
    url: input.url,
    image: input.image ? absoluteUrl(input.image) : undefined,
    datePublished: input.datePublished ?? undefined,
    dateModified: input.dateModified ?? undefined,
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Renaatus",
      legalName: siteConfig.legalName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/assets/logos/renaatus-logo-light.png"),
      },
    },
  };
}

export function productJsonLd(product: CatalogProduct): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.copy,
    image: absoluteUrl(product.image),
    brand: {
      "@type": "Brand",
      name: "Renacon",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Renaatus",
      legalName: siteConfig.legalName,
    },
  };
}

export function serviceListJsonLd(): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Renaatus services",
    itemListElement: verticals.map((vertical, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: vertical.title,
        description: vertical.copy,
        provider: {
          "@type": "Organization",
          name: "Renaatus",
          legalName: siteConfig.legalName,
        },
        url: absoluteUrl(vertical.href),
      },
    })),
  };
}
