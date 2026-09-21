import Image from "next/image";
import Link from "next/link";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { MediaFrame } from "@/design-system/components/media-frame";
import { Reveal } from "@/design-system/components/reveal";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";
import { company, founderLetter } from "@/lib/content";

export function HomeIntro() {
  const opening = founderLetter.paragraphs[0];

  return (
    <section className="bg-ink py-[var(--section-y)]">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <MediaFrame className="mx-auto aspect-[4/5] w-full max-w-md lg:mx-0 lg:max-w-none">
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
          <Eyebrow>The group</Eyebrow>
          <Heading variant="h2" className="mt-4 max-w-3xl">
            {company.visionTitle}
          </Heading>
          <Rule className="mt-6" />
          <Text variant="lead" className="mt-6">
            {company.vision}
          </Text>
          {opening ? <Text className="mt-6">{opening}</Text> : null}
          <p className="font-display text-cream mt-8 text-xl">{founderLetter.name}</p>
          <p className="text-eyebrow text-brass mt-1 tracking-[0.2em] uppercase">
            {founderLetter.role}
          </p>
          <Button asChild variant="secondary" className="mt-10">
            <Link href="/about">Read the story</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
