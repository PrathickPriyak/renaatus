"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-ink/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Renaatus home" onClick={() => setOpen(false)}>
          <Image
            src="/assets/logos/renaatus-mark.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg"
            priority
          />
          <span className="font-display text-xl tracking-[0.18em] uppercase">Renaatus</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[0.78rem] tracking-[0.18em] uppercase transition-colors ${
                  active ? "text-gold" : "text-cream/80 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full bg-brand px-5 py-2 text-[0.72rem] font-medium tracking-[0.16em] uppercase text-white transition hover:bg-brand-bright lg:inline-flex"
        >
          Enquire
        </Link>

        <button
          type="button"
          className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`h-px w-6 bg-cream transition ${open ? "translate-y-[4px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-cream transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-cream transition ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 bg-ink px-6 pt-28 lg:hidden">
          <nav className="flex flex-col gap-6" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-cream"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
