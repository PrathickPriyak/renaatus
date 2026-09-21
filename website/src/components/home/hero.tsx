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
      <div
        className="from-ink via-ink/75 to-ink/45 md:via-ink/50 md:to-ink/30 absolute inset-0 bg-gradient-to-t"
        aria-hidden
      />
      <div
        className="from-ink/80 via-ink/25 absolute inset-0 hidden bg-gradient-to-r to-transparent md:block"
        aria-hidden
      />
      <div
        className="from-ink via-ink/85 absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t to-transparent md:hidden"
        aria-hidden
      />
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
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/projects?type=realty">Explore residences</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/projects?type=infrastructure">View infrastructure</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
