"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, type NavLink as NavLinkItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  item: NavLinkItem;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
};

export function NavLink({ item, className, activeClassName, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(className, active && activeClassName)}
    >
      {item.label}
    </Link>
  );
}
