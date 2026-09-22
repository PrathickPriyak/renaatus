import Image from "next/image";
import Link from "next/link";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Reveal } from "@/design-system/components/reveal";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";
import { HoverMedia } from "@/components/marketing/hover-media";
import { aacHighlights } from "@/lib/content";

const aacStills = [
  "/assets/images/aac/block-01.jpg",
  "/assets/images/aac/block-02.jpg",
  "/assets/images/aac/block-03.jpg",
  "/assets/images/aac/block-04.jpg",
] as const;

export function HomeSolutions() {
  return (
    <section id="renacon" className="bg-ink py-[var(--section-y)]">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>Products</Eyebrow>
          <Heading variant="h2" className="mt-4">
            Renacon AAC blocks.
          </Heading>
          <Rule className="mt-6" />
          <Text variant="lead" className="mt-6">
            Renacon is South India’s leading brand of autoclaved aerated concrete — a
            versatile, eco-friendly wall material for schools, hospitals, workplaces,
            hotels, and homes.
          </Text>
          <ul className="mt-10 grid gap-8">
            {aacHighlights.map((item) => (
              <li key={item.title} className="border-brass border-l pl-5">
                <h3 className="text-h4 text-cream font-medium">{item.title}</h3>
                <Text className="mt-2">{item.copy}</Text>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-10">
            <Link href="/products">View products</Link>
          </Button>
        </Reveal>
        <Reveal>
          <div className="bg-line grid grid-cols-2 gap-px">
            {aacStills.map((src) => (
              <HoverMedia key={src} className="aspect-square">
                <Image
                  src={src}
                  alt="Renacon AAC blocks"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </HoverMedia>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
