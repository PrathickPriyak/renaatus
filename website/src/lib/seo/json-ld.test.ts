import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { products } from "@/lib/catalog";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  organizationJsonLd,
  productJsonLd,
  serviceListJsonLd,
  websiteJsonLd,
} from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { socialLinks } from "@/lib/navigation";

describe("structured data", () => {
  it("describes the organisation and website without invented facts", () => {
    const organization = organizationJsonLd();
    const website = websiteJsonLd();

    assert.equal(organization["@type"], "Organization");
    assert.equal(organization.legalName, "Renaatus Projects Pvt Ltd");
    const origin = siteConfig.url.replace(/\/$/, "");
    assert.equal(organization.url, origin);
    assert.ok(Array.isArray(organization.sameAs));
    assert.ok(organization.sameAs?.includes(socialLinks[0]?.href ?? ""));

    assert.equal(website["@type"], "WebSite");
    assert.equal(website.url, origin);
    assert.equal(website.name, "Renaatus");
  });

  it("builds breadcrumb and article graphs from real page data", () => {
    const crumbs = breadcrumbJsonLd([
      { href: "/", label: "Home" },
      { href: "/blog", label: "Journal" },
      { href: "/blog/renaatus-goes-live-with-sap", label: "Renaatus goes live with SAP" },
    ]);
    assert.equal(crumbs["@type"], "BreadcrumbList");
    assert.equal((crumbs.itemListElement as unknown[]).length, 3);

    const article = articleJsonLd({
      headline: "Renaatus goes live with SAP",
      description: "A new era of operational excellence.",
      url: "http://localhost:3000/blog/renaatus-goes-live-with-sap",
      image: "http://localhost:3000/assets/images/news/sap-live.jpg",
      datePublished: "2024-06-01T00:00:00.000Z",
      dateModified: "2024-06-02T00:00:00.000Z",
      authorName: "Renaatus Editorial",
    });
    assert.equal(article["@type"], "Article");
    assert.equal(article.headline, "Renaatus goes live with SAP");
    assert.equal((article.author as { name: string }).name, "Renaatus Editorial");
  });

  it("describes Renacon AAC as a product without fake offers or reviews", () => {
    const product = products[0];
    assert.ok(product);
    const json = productJsonLd(product);
    assert.equal(json["@type"], "Product");
    assert.equal(json.name, product.name);
    assert.equal("offers" in json, false);
    assert.equal("aggregateRating" in json, false);
    assert.equal("review" in json, false);
  });

  it("lists delivered verticals as services without invented lines", () => {
    const json = serviceListJsonLd();
    assert.equal(json["@type"], "ItemList");
    const items = json.itemListElement as Array<{ item: { "@type": string } }>;
    assert.equal(items.length, 3);
    assert.ok(items.every((entry) => entry.item["@type"] === "Service"));
  });
});
