import Link from "next/link";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Heading } from "@/design-system/components/heading";
import { Reveal } from "@/design-system/components/reveal";
import { Text } from "@/design-system/components/text";
import { HeroMedia } from "@/components/marketing/hero-media";
import { brand } from "@/lib/content";

export function HomeHero() {
  return (
    <section className="grain relative isolate min-h-[100dvh]">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <HeroMedia />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,14,0.55)_0%,rgba(7,9,14,0.15)_35%,rgba(7,9,14,0.72)_72%,rgba(7,9,14,0.96)_100%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(7,9,14,0.75)_0%,rgba(7,9,14,0.35)_42%,transparent_70%)] md:block" />
      </div>

      <Container className="relative flex min-h-[100dvh] flex-col justify-end pt-[calc(var(--header-height)+3rem)] pb-20 md:pb-24">
        <Reveal>
          <p className="font-display text-cream text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.02em]">
            {brand.name}
          </p>
          <Heading
            variant="h2"
            as="h1"
            className="text-cream/95 mt-6 max-w-3xl text-[clamp(1.35rem,2.4vw,2rem)] font-normal tracking-normal"
          >
            We build more than structures.
            <span className="text-brass"> We build futures.</span>
          </Heading>
          <Text variant="lead" className="text-cream-muted mt-6 max-w-xl">
            Half a century of construction trust across India, the Maldives, and
            Mauritius — infrastructure, luxury residences, and Renacon AAC.
          </Text>
          <div className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/projects?type=realty">Explore residences</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/projects?type=infrastructure">View infrastructure</Link>
            </Button>
          </div>
        </Reveal>

        <div className="text-cream-muted absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] tracking-[0.28em] uppercase md:flex">
          <span className="bg-brass/80 h-10 w-px animate-pulse" aria-hidden />
          Scroll
        </div>
      </Container>
    </section>
  );
}
