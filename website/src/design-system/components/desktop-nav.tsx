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
      className={cn("hidden items-center gap-5 lg:flex xl:gap-10", className)}
      aria-label="Primary"
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className="relative inline-flex min-h-11 items-center py-1 text-[0.7rem] tracking-[0.18em] text-cream uppercase transition-colors duration-200 hover:text-brass xl:tracking-[0.2em]"
          activeClassName="text-brass after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-brass"
        />
      ))}
    </nav>
  );
}
