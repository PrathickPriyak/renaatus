import Image from "next/image";
import Link from "next/link";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { MediaFrame } from "@/design-system/components/media-frame";
import { Reveal } from "@/design-system/components/reveal";
import { Text } from "@/design-system/components/text";
import { company, founderLetter } from "@/lib/content";

export function HomeIntro() {
  const opening = founderLetter.paragraphs[0];

  return (
    <section className="bg-ink py-[var(--section-y)]">
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
        <Reveal>
          <MediaFrame className="media-zoom mx-auto aspect-[4/5] w-full max-w-md lg:mx-0 lg:max-w-none">
            <Image
              src={founderLetter.image}
              alt={`${founderLetter.name}, ${founderLetter.role}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
          </MediaFrame>
        </Reveal>
        <Reveal>
          <Eyebrow>Est. legacy · The group</Eyebrow>
          <Heading variant="h2" className="mt-5 max-w-3xl">
            {company.visionTitle}
          </Heading>
          <div className="bg-brass/70 mt-8 h-px w-16" aria-hidden />
          <Text variant="lead" className="mt-8 max-w-2xl">
            {company.vision}
          </Text>
          {opening ? (
            <Text className="text-cream-muted mt-6 max-w-2xl text-[1.05rem] leading-8">
              {opening}
            </Text>
          ) : null}
          <div className="mt-10 border-t border-line pt-8">
            <p className="font-display text-cream text-2xl tracking-tight">
              {founderLetter.name}
            </p>
            <p className="text-eyebrow text-brass mt-2 tracking-[0.22em] uppercase">
              {founderLetter.role}
            </p>
          </div>
          <Button asChild variant="secondary" className="mt-10">
            <Link href="/about">Read the full story</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
