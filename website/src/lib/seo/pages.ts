import { siteConfig } from "@/lib/site";

export type PublicSeoPage = {
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  image?: string;
  imageAlt?: string;
  index?: boolean;
};

export const publicSeo = {
  home: {
    path: "/",
    title: "Renaatus | Building foundations across borders",
    description: siteConfig.description,
    absoluteTitle: true,
    image: "/assets/images/banners/infrastructure.jpg",
    imageAlt: "Renaatus infrastructure and luxury residences",
  },
  about: {
    path: "/about",
    title: "About",
    description:
      "The story of Renaatus — vision, mission, leadership, and a 50-year construction legacy across India, the Maldives, and Mauritius.",
    image: "/assets/images/about/about-renaatus.jpg",
    imageAlt: "Renaatus leadership and construction legacy",
  },
  whyRenaatus: {
    path: "/why-renaatus",
    title: "Why Renaatus",
    description:
      "Manufacturer and builder — 50 years of construction expertise, a global footprint, and Renacon AAC in the same group.",
  },
  projects: {
    path: "/projects",
    title: "Projects",
    description:
      "Realty and infrastructure delivered by Renaatus across India, the Maldives, and Mauritius.",
  },
  residences: {
    path: "/projects?type=realty",
    title: "Residences",
    description:
      "Ultra-luxury residences by Renaatus in the Maldives and India — Irumathi, Javaahiru, Ithaa Muiy, and Skyside.",
    image: "/assets/images/realty/maldives/irumathi-exterior.png",
    imageAlt: "Renaatus residence in the Maldives",
  },
  infrastructure: {
    path: "/projects?type=infrastructure",
    title: "Infrastructure projects",
    description:
      "Airports, courts, hospitals, irrigation, and housing — Renaatus EPC projects across India, Maldives, and Mauritius.",
    image: "/assets/images/verticals/infrastructure.jpg",
    imageAlt: "Renaatus infrastructure delivery",
  },
  products: {
    path: "/products",
    title: "Products",
    description:
      "Renacon AAC blocks — South India’s autoclaved aerated concrete from Renaatus.",
    image: "/assets/images/verticals/aac-blocks.jpg",
    imageAlt: "Renacon AAC blocks",
  },
  services: {
    path: "/services",
    title: "Services",
    description:
      "EPC infrastructure, luxury residences, and Renacon AAC materials from Renaatus — three lines the group already delivers.",
  },
  industries: {
    path: "/industries",
    title: "Industries",
    description:
      "Sectors drawn from work Renaatus has already delivered — aviation, healthcare, water, transport, civic buildings, and residences.",
  },
  careers: {
    path: "/careers",
    title: "Careers",
    description:
      "Join Renaatus — infrastructure, luxury residences, and Renacon AAC across India, the Maldives, and Mauritius.",
    image: "/assets/images/banners/careers.jpg",
    imageAlt: "Renaatus careers",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description: "Get in touch with Renaatus in Chennai, Maldives, and Mauritius.",
    image: "/assets/images/banners/contact.jpg",
    imageAlt: "Contact Renaatus",
  },
  blog: {
    path: "/blog",
    title: "Journal",
    description:
      "Published notes from Renaatus — civic partnerships, operations, and group news.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy",
    description: "Privacy policy for Renaatus Projects Pvt Ltd — pending legal review.",
  },
  terms: {
    path: "/terms",
    title: "Terms",
    description: "Terms of use for Renaatus Projects Pvt Ltd — pending legal review.",
  },
  cookies: {
    path: "/cookies",
    title: "Cookies",
    description: "Cookie notice for Renaatus Projects Pvt Ltd — pending legal review.",
  },
} as const satisfies Record<string, PublicSeoPage>;

export const indexableSeoPages: PublicSeoPage[] = Object.values(publicSeo);

export function resolvedSeoTitle(page: Pick<PublicSeoPage, "title" | "absoluteTitle">): string {
  if (page.absoluteTitle) {
    return page.title;
  }
  return `${page.title} | Renaatus`;
}
