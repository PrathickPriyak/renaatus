"use client";

import { CtaBand } from "@/design-system/components/cta-band";
import { shouldShowSiteCta } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export function SiteCta() {
  const pathname = usePathname();
  if (!shouldShowSiteCta(pathname)) return null;
  return <CtaBand />;
}
