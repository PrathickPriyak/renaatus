import Image from "next/image";
import { Breadcrumb } from "@/design-system/components/breadcrumb";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { crumbsForPath } from "@/lib/navigation";
import { HERO_IMAGE_QUALITY } from "@/lib/performance/hero-media";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt?: string;
  path?: string;
  breadcrumbItems?: { href: string; label: string }[];
};

export function PageHero({
  eyebrow,
  title,
  copy,
  image,
  imageAlt,
  path,
  breadcrumbItems,
}: PageHeroProps) {
  const crumbs = breadcrumbItems ?? (path ? crumbsForPath(path) : undefined);

  return (
    <section className="grain relative isolate min-h-[min(36rem,72dvh)] overflow-hidden">
      {crumbs && crumbs.length >= 2 ? <JsonLd data={breadcrumbJsonLd(crumbs)} /> : null}
      <Image
        src={image}
        alt={imageAlt ?? title}
        fill
        priority
        quality={HERO_IMAGE_QUALITY}
        className="object-cover"
        sizes="100vw"
      />
      <div className="from-ink via-ink/70 to-ink/35 absolute inset-0 bg-gradient-to-t" />
      <Container className="relative flex min-h-[min(36rem,72dvh)] flex-col justify-end pt-[calc(var(--header-height)+2rem)] pb-16">
        <Breadcrumb className="mb-8" items={crumbs} />
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading variant="h1" className="mt-4 max-w-4xl">
          {title}
        </Heading>
        <Rule className="mt-6" />
        <Text variant="lead" className="mt-6 max-w-2xl">
          {copy}
        </Text>
      </Container>
    </section>
  );
}
