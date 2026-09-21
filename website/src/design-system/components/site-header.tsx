"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { BrandLockup } from "@/design-system/components/logo";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  items: readonly NavItem[];
  cta?: { href: string; label: string };
};

export function SiteHeader({ items, cta }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open || pathname !== "/";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-colors duration-300",
          solid ? "border-b border-line bg-ink" : "bg-transparent",
        )}
      >
        <Container className="flex h-[4.75rem] items-center justify-between">
          <Link
            href="/"
            className="relative z-50"
            aria-label="Renaatus home"
            onClick={() => setOpen(false)}
          >
            <BrandLockup priority />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[0.7rem] tracking-[0.2em] uppercase transition-colors duration-200",
                    active ? "text-brass" : "text-cream hover:text-brass",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-0 -bottom-1 h-px bg-brass" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {cta ? (
            <Button asChild size="sm" className="relative z-50 hidden lg:inline-flex">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : (
            <span className="hidden lg:block" />
          )}

          <button
            type="button"
            className="relative z-50 flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={cn(
                "h-px w-5 bg-cream transition-transform duration-200",
                open && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-cream transition-opacity duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-cream transition-transform duration-200",
                open && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </Container>
      </header>

      {open ? (
        <div
          id={menuId}
          className="fixed inset-0 z-[60] bg-ink px-[var(--gutter)] pt-28 lg:hidden"
        >
          <nav className="flex flex-col gap-7" aria-label="Mobile">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-cream"
              >
                {item.label}
              </Link>
            ))}
            {cta ? (
              <Button asChild className="mt-4 w-fit">
                <Link href={cta.href} onClick={() => setOpen(false)}>
                  {cta.label}
                </Link>
              </Button>
            ) : null}
          </nav>
        </div>
      ) : null}
    </>
  );
}
