"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useEffect, useRef, type RefObject } from "react";
import { Button } from "@/design-system/components/button";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { NavLink } from "@/design-system/components/nav-link";
import { fadeTransition } from "@/design-system/motion";
import {
  headerCta,
  primaryNav,
  secondaryNav,
  type NavLink as NavLinkItem,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: readonly NavLinkItem[];
  secondary?: readonly NavLinkItem[];
  cta?: NavLinkItem;
  buttonRef?: RefObject<HTMLButtonElement | null>;
};

export const MobileMenuButton = forwardRef<
  HTMLButtonElement,
  {
    open: boolean;
    onToggle: () => void;
    controlsId: string;
  }
>(function MobileMenuButton({ open, onToggle, controlsId }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className="relative z-50 flex h-11 w-11 min-h-11 min-w-11 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onToggle}
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
  );
});

export function MobileMenu({
  id,
  open,
  onOpenChange,
  items = primaryNav,
  secondary = secondaryNav,
  cta = headerCta,
  buttonRef,
}: MobileMenuProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  useEffect(() => {
    if (wasOpen.current && !open) {
      buttonRef?.current?.focus();
    }
    wasOpen.current = open;
  }, [open, buttonRef]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusable = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
      : [];
    focusable[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={id}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink px-[var(--gutter)] pt-[calc(var(--header-height)+1.5rem)] pb-10 lg:hidden"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={fadeTransition}
        >
          <nav className="flex flex-col gap-5" aria-label="Mobile">
            {items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onNavigate={() => onOpenChange(false)}
                className="font-display text-4xl leading-tight text-cream break-words transition-colors duration-200 hover:text-brass md:text-5xl"
                activeClassName="text-brass"
              />
            ))}
          </nav>

          {secondary.length > 0 ? (
            <div className="mt-12">
              <Eyebrow>Further</Eyebrow>
              <nav className="mt-5 flex flex-col gap-1" aria-label="Secondary">
                {secondary.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    onNavigate={() => onOpenChange(false)}
                    className="inline-flex min-h-11 items-center text-sm tracking-[0.16em] text-cream uppercase transition-colors duration-200 hover:text-brass"
                    activeClassName="text-brass"
                  />
                ))}
              </nav>
            </div>
          ) : null}

          <Button asChild className="mt-auto w-fit">
            <Link href={cta.href} onClick={() => onOpenChange(false)}>
              {cta.label}
            </Link>
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { MobileMenu as MobileNav };
