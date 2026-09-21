"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { crumbsForPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type BreadcrumbProps = {
  className?: string;
  /** Replace auto crumbs from the path when a page needs a specific trail. */
  items?: { href: string; label: string }[];
};

export function Breadcrumb({ className, items }: BreadcrumbProps) {
  const pathname = usePathname();
  const crumbs = items ?? crumbsForPath(pathname);
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-caption text-cream/70", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-cream/35">
                  /
                </span>
              ) : null}
              {last ? (
                <span aria-current="page" className="text-cream">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="transition-colors duration-200 hover:text-brass">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
