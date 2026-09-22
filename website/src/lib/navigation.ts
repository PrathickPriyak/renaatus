/**
 * Single source of truth for public navigation.
 * Derived from docs/architecture/PRODUCTION.md — do not duplicate lists in UI.
 */

export type NavMatch = "exact" | "prefix";

export type NavLink = {
  href: string;
  label: string;
  match?: NavMatch;
};

export const HEADER_HEIGHT_CLASS = "h-[var(--header-height)]";

/** Short primary bar. Home is the mark; Enquire is the CTA. */
export const primaryNav = [
  { href: "/about", label: "About", match: "prefix" },
  { href: "/projects", label: "Projects", match: "prefix" },
  { href: "/products", label: "Products", match: "prefix" },
  { href: "/services", label: "Services", match: "prefix" },
  { href: "/careers", label: "Careers", match: "exact" },
] as const satisfies readonly NavLink[];

export const headerCta = {
  href: "/contact",
  label: "Enquire",
} as const satisfies NavLink;

/** Extra destinations on the mobile overlay and in the footer About cluster. */
export const secondaryNav = [
  { href: "/why-renaatus", label: "Why Renaatus", match: "exact" },
  { href: "/industries", label: "Industries", match: "exact" },
  { href: "/blog", label: "Journal", match: "prefix" },
] as const satisfies readonly NavLink[];

export const footerExploreNav = [
  { href: "/projects", label: "Projects" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/blog", label: "Journal" },
] as const satisfies readonly NavLink[];

export const footerCompanyNav = [
  { href: "/about", label: "About" },
  { href: "/why-renaatus", label: "Why Renaatus" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const satisfies readonly NavLink[];

export const legalNav = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
] as const satisfies readonly NavLink[];

/** Confirmed public profile only. Do not add networks that are not in brand materials. */
export const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/renaatusprojects",
  },
] as const;

export const routeLabels: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/why-renaatus": "Why Renaatus",
  "/projects": "Projects",
  "/products": "Products",
  "/services": "Services",
  "/industries": "Industries",
  "/blog": "Journal",
  "/journal": "Journal",
  "/contact": "Contact",
  "/careers": "Careers",
  "/privacy": "Privacy",
  "/terms": "Terms",
  "/cookies": "Cookies",
  "/design-system": "Design system",
};

export const prototypeRedirects = [
  { source: "/realty", destination: "/projects?type=realty" },
  { source: "/infrastructure", destination: "/projects?type=infrastructure" },
  { source: "/journal", destination: "/blog" },
] as const;

const CTA_HIDDEN = new Set(["/", "/contact", "/careers", "/privacy", "/terms", "/cookies"]);

export function shouldShowSiteCta(pathname: string): boolean {
  if (CTA_HIDDEN.has(pathname)) return false;
  if (pathname === "/design-system" || pathname.startsWith("/design-system/")) return false;
  return true;
}

export function pathWithoutQuery(href: string): string {
  const [path] = href.split("?");
  return path ?? href;
}

export function isActivePath(pathname: string, item: NavLink): boolean {
  const href = pathWithoutQuery(item.href);
  if (href === "/") return pathname === "/";
  const match = item.match ?? "prefix";
  if (match === "exact") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type Crumb = {
  href: string;
  label: string;
};

function titleFromSlug(slug: string): string {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function crumbsForPath(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ href: "/", label: routeLabels["/"] ?? "Home" }];
  if (pathname === "/") return crumbs;

  const parts = pathname.split("/").filter(Boolean);
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    crumbs.push({
      href: acc,
      label: routeLabels[acc] ?? titleFromSlug(part),
    });
  }
  return crumbs;
}
