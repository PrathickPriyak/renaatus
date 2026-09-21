"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Button } from "@/design-system/components/button";
import { BrandWordmark } from "@/design-system/components/logo";
import { MobileMenuButton } from "@/design-system/components/mobile-menu";
import { isAdminNavActive, type AdminNavItem } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";
import { signOutStaff } from "@/server/actions/auth";

type AdminShellProps = {
  actorName: string;
  actorEmail: string;
  actorRole: string;
  items: AdminNavItem[];
  children: ReactNode;
};

function NavLinks({
  items,
  pathname,
  onNavigate,
  className,
}: {
  items: AdminNavItem[];
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Admin">
      {items.map((item) => {
        const active = isAdminNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-sm px-3 py-2 text-sm tracking-[0.12em] uppercase transition-colors duration-200",
              active
                ? "bg-brand text-white"
                : "text-cream/75 hover:bg-cream/5 hover:text-cream",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileAdminBar({
  items,
  pathname,
  actorName,
  actorRole,
}: {
  items: AdminNavItem[];
  pathname: string;
  actorName: string;
  actorRole: string;
}) {
  const menuId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="border-line bg-ink/95 sticky top-0 z-40 flex items-center justify-between border-b px-[var(--gutter)] py-3 lg:hidden">
        <Link href="/admin" aria-label="Admin dashboard">
          <BrandWordmark priority />
        </Link>
        <div className="flex items-center gap-2">
          <form action={signOutStaff}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
          <MobileMenuButton
            open={open}
            onToggle={() => setOpen((value) => !value)}
            controlsId={menuId}
          />
        </div>
      </header>

      {open ? (
        <div
          id={menuId}
          className="border-line bg-ink fixed inset-x-0 top-[3.75rem] z-40 border-b px-[var(--gutter)] py-6 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          <NavLinks items={items} pathname={pathname} onNavigate={() => setOpen(false)} />
          <p className="text-caption text-cream-muted mt-6">
            {actorName} · {actorRole}
          </p>
        </div>
      ) : null}
    </>
  );
}

export function AdminShell({
  actorName,
  actorEmail,
  actorRole,
  items,
  children,
}: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="bg-ink flex min-h-full flex-1 flex-col">
      <a
        href="#admin-main"
        className="bg-brand sr-only text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <MobileAdminBar
        key={pathname}
        items={items}
        pathname={pathname}
        actorName={actorName}
        actorRole={actorRole}
      />

      <div className="lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside className="border-line bg-ink-soft hidden min-h-screen flex-col border-r px-5 py-8 lg:flex">
          <Link href="/admin" aria-label="Admin dashboard" className="px-1">
            <BrandWordmark priority />
          </Link>
          <p className="text-eyebrow text-brass mt-8 px-3 tracking-[0.2em] uppercase">
            Staff
          </p>
          <NavLinks items={items} pathname={pathname} className="mt-3 flex-1" />
          <div className="border-line mt-8 border-t pt-6">
            <p className="text-cream text-sm">{actorName}</p>
            <p className="text-caption text-cream-muted mt-1 break-all">{actorEmail}</p>
            <p className="text-caption text-brass mt-2 tracking-[0.14em] uppercase">
              {actorRole}
            </p>
            <form action={signOutStaff} className="mt-5">
              <Button type="submit" variant="secondary" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <main id="admin-main" className="min-w-0 px-[var(--gutter)] py-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
