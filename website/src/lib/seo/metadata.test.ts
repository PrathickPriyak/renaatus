import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { catalogProjects, projectSeoDescription } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { indexableSeoPages, resolvedSeoTitle } from "@/lib/seo/pages";
import { siteConfig } from "@/lib/site";

describe("public SEO catalog", () => {
  it("gives every indexable page a unique title and description", () => {
    const titles = indexableSeoPages.map((page) => resolvedSeoTitle(page));
    const descriptions = indexableSeoPages.map((page) => page.description);

    assert.equal(new Set(titles).size, titles.length);
    assert.equal(new Set(descriptions).size, descriptions.length);
    assert.ok(titles.length >= 12);
  });

  it("builds canonical, Open Graph, and social preview metadata", () => {
    const metadata = pageMetadata({
      path: "/about",
      title: "About Renaatus",
      description: "The story of Renaatus across India, the Maldives, and Mauritius.",
    });

    const origin = siteConfig.url.replace(/\/$/, "");
    assert.equal(metadata.alternates?.canonical, `${origin}/about`);
    assert.equal(metadata.openGraph?.url, `${origin}/about`);
    assert.equal(metadata.openGraph?.title, "About Renaatus | Renaatus");
    assert.equal(
      metadata.openGraph?.description,
      "The story of Renaatus across India, the Maldives, and Mauritius.",
    );
    assert.ok(metadata.openGraph && "images" in metadata.openGraph);
    assert.ok(metadata.twitter && "card" in metadata.twitter);
    assert.equal(metadata.twitter.card, "summary_large_image");
    assert.equal(metadata.twitter.title, "About Renaatus | Renaatus");
    assert.deepEqual(metadata.robots, { index: true, follow: true });
  });

  it("marks private surfaces as noindex", () => {
    const metadata = pageMetadata({
      path: "/login",
      title: "Staff sign in",
      description: "Authorised staff access only.",
      index: false,
    });

    assert.deepEqual(metadata.robots, { index: false, follow: false });
  });

  it("gives each catalog project a distinct description", () => {
    const descriptions = catalogProjects.map(projectSeoDescription);
    assert.equal(new Set(descriptions).size, descriptions.length);
  });

  it("resolves relative canonical paths to absolute URLs", () => {
    const origin = siteConfig.url.replace(/\/$/, "");
    const metadata = pageMetadata({
      path: "/realty",
      title: "Realty",
      description: "Redirected realty archive.",
      index: false,
      canonical: "/projects?type=realty",
    });
    assert.equal(metadata.alternates?.canonical, `${origin}/projects?type=realty`);
  });
});
