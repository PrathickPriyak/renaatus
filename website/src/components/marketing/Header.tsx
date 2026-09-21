"use client";

import { SiteHeader } from "@/design-system";
import { nav } from "@/lib/content";

export function Header() {
  return <SiteHeader items={nav} cta={{ href: "/contact", label: "Enquire" }} />;
}
