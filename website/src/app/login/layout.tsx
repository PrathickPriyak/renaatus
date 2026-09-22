import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BrandWordmark } from "@/design-system/components/logo";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/login",
  title: "Staff sign in",
  description: "Authorised staff access only.",
  index: false,
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="px-[var(--gutter)] py-6">
        <Link href="/" aria-label="Renaatus home">
          <BrandWordmark />
        </Link>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
    </div>
  );
}
