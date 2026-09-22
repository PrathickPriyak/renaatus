import {
  aacHighlights,
  infrastructureProjects,
  realtyProjects,
  type InfraProject,
  type RealtyProject,
} from "@/lib/content";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CatalogProject = {
  slug: string;
  kind: "realty" | "infrastructure";
  name: string;
  image: string;
  copy?: string;
  location?: string;
  country?: InfraProject["country"];
  year?: string;
  externalHref?: string;
  gallery: string[];
};

function realtyEntry(project: RealtyProject): CatalogProject {
  return {
    slug: slugify(project.name),
    kind: "realty",
    name: project.name,
    image: project.image,
    copy: project.copy,
    location: project.location,
    externalHref: project.href,
    gallery: [project.image],
  };
}

function infraEntry(project: InfraProject): CatalogProject {
  return {
    slug: slugify(project.name),
    kind: "infrastructure",
    name: project.name,
    image: project.image,
    country: project.country,
    year: project.year,
    gallery: project.gallery ?? [project.image],
  };
}

export const catalogProjects: CatalogProject[] = [
  ...realtyProjects.map(realtyEntry),
  ...infrastructureProjects.map(infraEntry),
];

export function getProjectBySlug(slug: string): CatalogProject | undefined {
  return catalogProjects.find((project) => project.slug === slug);
}

export const aacStills = [
  "/assets/images/aac/block-01.jpg",
  "/assets/images/aac/block-02.jpg",
  "/assets/images/aac/block-03.jpg",
  "/assets/images/aac/block-04.jpg",
] as const;

export const products = [
  {
    slug: "renacon-aac-blocks",
    name: "Renacon AAC blocks",
    kicker: "Renacon",
    image: "/assets/images/verticals/aac-blocks.jpg",
    copy: "Renacon is South India’s leading brand of autoclaved aerated concrete — a versatile, eco-friendly wall material for schools, hospitals, workplaces, hotels, and homes.",
    highlights: aacHighlights,
    stills: aacStills,
  },
] as const;

export type CatalogProduct = (typeof products)[number];

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return products.find((product) => product.slug === slug);
}

export function projectHref(slug: string): string {
  return `/projects/${slug}`;
}

export function projectMeta(project: CatalogProject): string {
  if (project.kind === "realty") {
    return project.location ?? "CONTENT_REQUIRED";
  }
  const parts = [project.country, project.year].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "CONTENT_REQUIRED";
}

export function projectSeoDescription(project: CatalogProject): string {
  if (project.copy?.trim()) {
    return project.copy;
  }
  const meta = projectMeta(project);
  const kindLabel = project.kind === "realty" ? "residence" : "infrastructure project";
  if (meta && meta !== "CONTENT_REQUIRED") {
    return `${project.name} is a Renaatus ${kindLabel} — ${meta}.`;
  }
  return `${project.name} is a Renaatus ${kindLabel}.`;
}
