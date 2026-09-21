import type { ReactNode } from "react";
import Link from "next/link";
import { BrandWordmark } from "@/design-system/components/logo";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="px-[var(--gutter)] py-6">
        <Link href="/" aria-label="Renaatus home">
          <BrandWordmark />
        </Link>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}
