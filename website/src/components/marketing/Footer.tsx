import { SiteFooter } from "@/design-system";
import { brand, nav, offices } from "@/lib/content";

export function Footer() {
  return (
    <SiteFooter
      items={nav}
      offices={offices}
      legalName={brand.legal}
      tagline="EPC, luxury realty, and Renacon AAC — across India, the Maldives, and Mauritius."
    />
  );
}
