import Link from "next/link";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Reveal } from "@/design-system/components/reveal";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";
import { HeroMedia } from "@/components/marketing/hero-media";

export function HomeHero() {
  return (
    <section className="grain relative isolate min-h-[100dvh] overflow-hidden">
      <HeroMedia />
      <div className="from-ink/40 via-ink/25 to-ink absolute inset-0 bg-gradient-to-b" />
      <Container className="relative flex min-h-[100dvh] flex-col justify-end pt-[calc(var(--header-height)+2rem)] pb-16 md:pb-20">
        <Reveal>
          <Eyebrow>Renaatus Projects</Eyebrow>
          <Heading variant="display" className="mt-5 max-w-5xl">
            We build more than structures.
            <span className="text-brass mt-2 block">We build futures.</span>
          </Heading>
          <Rule className="mt-8" />
          <Text variant="lead" className="mt-8 max-w-xl">
            Half a century of trust across India, Maldives, and Mauritius —
            infrastructure, luxury residences, and green building materials.
          </Text>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/projects?type=realty">Explore residences</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/projects?type=infrastructure">View infrastructure</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
