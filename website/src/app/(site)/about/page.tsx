import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Text } from "@/design-system/components/text";
import { company, founderLetter, leadership, timeline } from "@/lib/content";

import { pageMetadataFromSeo } from "@/lib/seo/metadata";
import { publicSeo } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadataFromSeo(publicSeo.about);

const aboutStills = [
  {
    src: "/assets/images/about/grid-1.png",
    alt: "Renaatus project photography, still 1",
  },
  {
    src: "/assets/images/about/grid-2.png",
    alt: "Renaatus project photography, still 2",
  },
  {
    src: "/assets/images/about/grid-3.png",
    alt: "Renaatus project photography, still 3",
  },
  {
    src: "/assets/images/about/grid-4.png",
    alt: "Renaatus project photography, still 4",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        path="/about"
        eyebrow="About"
        title="A square foot for everyone. Space for every dream."
        copy="With one million square feet in our sights, we begin with Renaatus Realty — shaping lives, building communities, and turning possibility into place."
        image="/assets/images/about/about-renaatus.jpg"
        imageAlt="Renaatus leadership and construction legacy"
      />

      <Section
        tone="soft"
        eyebrow="Purpose"
        title="Vision and mission."
        intro="Drawn from the group’s published statement of purpose — not a rewritten manifesto."
      >
        <div className="bg-line grid gap-px md:grid-cols-2">
          <Reveal>
            <article className="bg-ink-soft h-full p-7 md:p-10">
              <h2 className="font-display text-h3 text-cream">{company.visionTitle}</h2>
              <Text className="mt-4">{company.vision}</Text>
            </article>
          </Reveal>
          <Reveal transition={{ delay: 0.06 }}>
            <article className="bg-ink-soft h-full p-7 md:p-10">
              <h2 className="font-display text-h3 text-cream">{company.missionTitle}</h2>
              <Text className="mt-4">{company.mission}</Text>
            </article>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="From the founder’s desk" title="A letter from the Chairman.">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <HoverMedia className="mx-auto aspect-[4/5] w-full max-w-md lg:mx-0 lg:max-w-none">
            <Image
              src={founderLetter.image}
              alt={`${founderLetter.name}, ${founderLetter.role}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
          </HoverMedia>
          <div>
            <div className="space-y-5">
              {founderLetter.paragraphs.map((paragraph) => (
                <Text key={paragraph.slice(0, 32)}>{paragraph}</Text>
              ))}
            </div>
            <p className="font-display text-cream mt-8 text-xl">{founderLetter.name}</p>
            <p className="text-eyebrow text-brass mt-1 tracking-[0.2em] uppercase">
              {founderLetter.role}
            </p>
          </div>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Since our inception" title="A timeline of ambition.">
        <ol className="bg-line grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {timeline.map((item, index) => (
            <Reveal key={item.year} transition={{ delay: index * 0.04 }}>
              <li className="bg-ink-soft h-full p-7">
                <p className="font-display text-h2 text-brass">{item.year}</p>
                <h3 className="text-h4 text-cream mt-4 font-medium">{item.title}</h3>
                <Text className="mt-3">{item.copy}</Text>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section eyebrow="The group" title="Places and people already in the work.">
        <div className="bg-line grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {aboutStills.map((still) => (
            <HoverMedia key={still.src} className="aspect-[4/5]">
              <Image
                src={still.src}
                alt={still.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </HoverMedia>
          ))}
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="Key people"
        title="Leadership."
        intro="Only leaders with confirmed names, roles, and biographies are listed here."
      >
        <div className="grid gap-10 lg:grid-cols-2">
          {leadership.map((person) => (
            <article
              key={person.name}
              className="grid gap-6 md:grid-cols-[12.5rem_minmax(0,1fr)] md:items-start"
            >
              <HoverMedia className="aspect-[3/4] w-full max-w-[13rem]">
                <Image
                  src={person.image}
                  alt={`${person.name}, ${person.role}`}
                  fill
                  className="object-cover object-top"
                  sizes="200px"
                />
              </HoverMedia>
              <div>
                <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">
                  {person.role}
                </p>
                <h3 className="font-display text-h3 text-cream mt-2">{person.name}</h3>
                <Text className="mt-4">{person.bio}</Text>
              </div>
            </article>
          ))}
        </div>
        <Button asChild variant="secondary" className="mt-12">
          <Link href="/why-renaatus">Why Renaatus</Link>
        </Button>
      </Section>
    </>
  );
}
