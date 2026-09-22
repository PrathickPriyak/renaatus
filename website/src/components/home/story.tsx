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
import { getDb } from "@/lib/db";
import { getFeaturedPublishedBlog } from "@/lib/blog/public";

export async function HomeStory() {
  const story = await getFeaturedPublishedBlog(getDb());
  if (!story) {
    return null;
  }

  return (
    <section className="grain relative isolate min-h-[min(40rem,92dvh)] overflow-hidden">
      {story.image ? (
        <ParallaxMedia className="absolute inset-0">
          <Image
            src={story.image.src}
            alt={story.image.alt || story.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1920px) 100vw, 1920px"
          />
        </ParallaxMedia>
      ) : null}
      <div className="from-ink via-ink/70 to-ink/35 absolute inset-0 bg-gradient-to-t" />
      <Container className="relative flex min-h-[min(40rem,92dvh)] flex-col justify-end pt-24 pb-16 md:pb-20">
        <Reveal className="max-w-3xl">
          <Eyebrow>{story.category?.name ?? "Journal"}</Eyebrow>
          <Heading variant="h2" className="mt-4">
            {story.title}
          </Heading>
          <Rule className="mt-6" />
          <Text variant="lead" className="mt-6">
            {story.excerpt}
          </Text>
          <Button asChild className="mt-10">
            <Link href={story.href}>Read the journal</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
