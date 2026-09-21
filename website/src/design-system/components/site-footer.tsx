import Link from "next/link";
import { BrandLockup } from "@/design-system/components/logo";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Text } from "@/design-system/components/text";
import type { NavItem } from "@/design-system/components/site-header";

type Office = {
  region: string;
  address: string;
  email: string;
  phone?: string;
};

type SiteFooterProps = {
  items: readonly NavItem[];
  offices: readonly Office[];
  legalName: string;
  tagline?: string;
};

export function SiteFooter({
  items,
  offices,
  legalName,
  tagline = "Forward together.",
}: SiteFooterProps) {
  const featuredOffices = offices.slice(0, 2);

  return (
    <footer className="border-t border-line bg-ink-soft">
      <Container className="grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label="Renaatus home">
            <BrandLockup />
          </Link>
          <Text variant="muted" className="mt-6 max-w-xs">
            {tagline}
          </Text>
        </div>

        <div>
          <Eyebrow>Explore</Eyebrow>
          <ul className="mt-5 space-y-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cream transition-colors duration-200 hover:text-brass"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {featuredOffices.map((office) => (
          <div key={office.region}>
            <Eyebrow>{office.region}</Eyebrow>
            <Text variant="muted" className="mt-5">
              {office.address}
            </Text>
            <a
              href={`mailto:${office.email}`}
              className="mt-3 block text-sm text-cream transition-colors duration-200 hover:text-brass"
            >
              {office.email}
            </a>
            {office.phone ? (
              <a
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                className="mt-1 block text-sm text-cream/70"
              >
                {office.phone}
              </a>
            ) : null}
          </div>
        ))}
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-6 text-caption text-cream-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {legalName}. All rights reserved.
          </p>
          <p>India · Maldives · Mauritius</p>
        </Container>
      </div>
    </footer>
  );
}
