import Link from "next/link";
import { BrandLockup } from "@/design-system/components/logo";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Text } from "@/design-system/components/text";
import { brand, offices } from "@/lib/content";
import {
  footerCompanyNav,
  footerExploreNav,
  headerCta,
  legalNav,
  socialLinks,
} from "@/lib/navigation";

type SiteFooterProps = {
  legalName?: string;
  tagline?: string;
};

export function SiteFooter({
  legalName = brand.legal,
  tagline = "EPC, luxury realty, and Renacon AAC — across India, the Maldives, and Mauritius.",
}: SiteFooterProps) {
  const headquarters = offices[0];

  return (
    <footer className="border-t border-line bg-ink-soft">
      <Container className="grid gap-14 py-20 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label="Renaatus home">
            <BrandLockup />
          </Link>
          <Text variant="muted" className="mt-6 max-w-xs">
            {tagline}
          </Text>
          <Button asChild className="mt-8">
            <Link href={headerCta.href}>{headerCta.label}</Link>
          </Button>
          {socialLinks.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-4">
              {socialLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                    className="text-sm tracking-[0.14em] text-cream uppercase transition-colors duration-200 hover:text-brass"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <Eyebrow>Explore</Eyebrow>
          <ul className="mt-5 space-y-3">
            {footerExploreNav.map((item) => (
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

        <div>
          <Eyebrow>Company</Eyebrow>
          <ul className="mt-5 space-y-3">
            {footerCompanyNav.map((item) => (
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

        <div>
          <Eyebrow>Contact</Eyebrow>
          {headquarters ? (
            <>
              <Text variant="muted" className="mt-5">
                {headquarters.address}
              </Text>
              <a
                href={`mailto:${headquarters.email}`}
                className="mt-3 block text-sm text-cream transition-colors duration-200 hover:text-brass"
              >
                {headquarters.email}
              </a>
              {headquarters.phone ? (
                <a
                  href={`tel:${headquarters.phone.replace(/\s/g, "")}`}
                  className="mt-1 block text-sm text-cream/70"
                >
                  {headquarters.phone}
                </a>
              ) : null}
            </>
          ) : null}
          <ul className="mt-6 space-y-2">
            {offices.slice(1).map((office) => (
              <li key={office.region}>
                <a
                  href={`mailto:${office.email}`}
                  className="text-sm text-cream transition-colors duration-200 hover:text-brass"
                >
                  {office.region} · {office.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6 text-caption text-cream-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors duration-200 hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>India · Maldives · Mauritius</p>
        </Container>
      </div>
    </footer>
  );
}
