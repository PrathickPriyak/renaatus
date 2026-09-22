"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLockup } from "@/design-system/components/logo";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { DesktopNav } from "@/design-system/components/desktop-nav";
import { MobileMenu, MobileMenuButton } from "@/design-system/components/mobile-menu";
import {
  headerCta,
  primaryNav,
  secondaryNav,
  type NavLink,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

export type NavItem = NavLink;

type SiteHeaderProps = {
  items?: readonly NavLink[];
  secondary?: readonly NavLink[];
  cta?: NavLink;
};

export function SiteHeader({
  items = primaryNav,
  secondary = secondaryNav,
  cta = headerCta,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] h-[var(--header-height)] transition-colors duration-300",
          solid ? "border-b border-line bg-ink" : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className="grid h-full grid-cols-[1fr_auto] items-center lg:grid-cols-[auto_1fr_auto] lg:gap-8">
          <Link
            href="/"
            className="relative z-50 inline-flex min-h-11 w-fit items-center"
            aria-label="Renaatus home"
            onClick={() => setOpen(false)}
          >
            <BrandLockup priority />
          </Link>

          <div className="hidden justify-center lg:flex">
            <DesktopNav items={items} />
          </div>

          <div className="flex items-center justify-end">
            {cta ? (
              <Button asChild size="sm" className="relative z-50 hidden lg:inline-flex">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ) : null}

            <MobileMenuButton
              ref={buttonRef}
              open={open}
              controlsId={menuId}
              onToggle={() => setOpen((value) => !value)}
            />
          </div>
        </Container>
      </header>

      <MobileMenu
        id={menuId}
        open={open}
        onOpenChange={setOpen}
        items={items}
        secondary={secondary}
        cta={cta}
        buttonRef={buttonRef}
      />
    </>
  );
}
