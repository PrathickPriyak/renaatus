import Image from "next/image";
import Link from "next/link";
import { ParallaxMedia } from "@/components/marketing/parallax-media";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Reveal } from "@/design-system/components/reveal";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";
import { news } from "@/lib/content";

const story = news[0];

export function HomeStory() {
  return (
    <section className="grain relative isolate min-h-[min(40rem,92dvh)] overflow-hidden">
      <ParallaxMedia className="absolute inset-0">
        <Image
          src={story.image}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </ParallaxMedia>
      <div className="from-ink via-ink/70 to-ink/35 absolute inset-0 bg-gradient-to-t" />
      <Container className="relative flex min-h-[min(40rem,92dvh)] flex-col justify-end pt-24 pb-16 md:pb-20">
        <Reveal className="max-w-3xl">
          <Eyebrow>In the skyline</Eyebrow>
          <Heading variant="h2" className="mt-4">
            {story.title}
          </Heading>
          <Rule className="mt-6" />
          <Text variant="lead" className="mt-6">
            {story.copy}
          </Text>
          <Button asChild className="mt-10">
            <Link href="/journal">Read the journal</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
