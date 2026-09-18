import Image from "next/image";
import Link from "next/link";
import { brand, nav, offices } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/logos/renaatus-mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-md"
            />
            <span className="font-display text-lg tracking-[0.2em] uppercase">Renaatus</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-muted">
            Premier engineering, procurement, and construction — with luxury realty and green building materials.
          </p>
        </div>

        <div>
          <p className="kicker">Explore</p>
          <ul className="mt-4 space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-cream/80 hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {offices.slice(0, 2).map((office) => (
          <div key={office.region}>
            <p className="kicker">{office.region}</p>
            <p className="mt-4 text-sm leading-7 text-muted">{office.address}</p>
            <a href={`mailto:${office.email}`} className="mt-3 block text-sm text-cream hover:text-gold">
              {office.email}
            </a>
            {office.phone ? (
              <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm text-cream/80">
                {office.phone}
              </a>
            ) : null}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {brand.legal}. All rights reserved.
          </p>
          <p>India · Maldives · Mauritius</p>
        </div>
      </div>
    </footer>
  );
}
