import type { ReactNode } from "react";
import { Footer, Header } from "@/components/marketing";
import { SiteCta } from "@/design-system";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteCta />
      <Footer />
    </div>
  );
}
