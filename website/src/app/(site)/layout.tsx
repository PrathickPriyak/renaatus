import type { ReactNode } from "react";
import { Footer, Header } from "@/components/marketing";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteCta } from "@/design-system";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteCta />
      <Footer />
    </div>
  );
}
