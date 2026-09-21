import Link from "next/link";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Text } from "@/design-system/components/text";
import { headerCta } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type CtaBandProps = {
  eyebrow?: string;
  title?: string;
  copy?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  className?: string;
};

export function CtaBand({
  eyebrow = "Contact",
  title = "Let’s build something remarkable.",
  copy = "Reach the team that delivers infrastructure, residences, and materials across India, the Maldives, and Mauritius.",
  primary = headerCta,
  secondary = { href: "/projects", label: "View projects" },
  className,
}: CtaBandProps) {
  return (
    <section className={cn("border-t border-line bg-ink", className)}>
      <Container className="flex flex-col gap-8 py-[var(--section-y)] lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-h1 text-cream">{title}</h2>
          <Text variant="lead" className="mt-5">
            {copy}
          </Text>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
          {secondary ? (
            <Button asChild variant="secondary">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
