"use client";

import { NavLink } from "@/design-system/components/nav-link";
import type { NavLink as NavLinkItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type DesktopNavProps = {
  items: readonly NavLinkItem[];
  className?: string;
};

export function DesktopNav({ items, className }: DesktopNavProps) {
  return (
    <nav
      className={cn("hidden items-center gap-7 xl:gap-10 lg:flex", className)}
      aria-label="Primary"
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className="relative py-1 text-[0.7rem] tracking-[0.2em] text-cream uppercase transition-colors duration-200 hover:text-brass"
          activeClassName="text-brass after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-brass"
        />
      ))}
    </nav>
  );
}
