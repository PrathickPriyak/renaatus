import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Section } from "@/design-system/components/section";
import { Reveal } from "@/design-system/components/reveal";
import { Text } from "@/design-system/components/text";
import { news } from "@/lib/content";

export function HomeJournal() {
  return (
    <Section
      eyebrow="Journal"
      title="From the group."
      intro="Published notes only — the CMRL partnership and the SAP go-live."
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        {news.map((item, index) => (
          <Reveal key={item.title} transition={{ delay: index * 0.06 }}>
            <article>
              <HoverMedia className="aspect-[16/9]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </HoverMedia>
              <h3 className="font-display text-h3 text-cream mt-6">{item.title}</h3>
              <Text className="mt-3">{item.copy}</Text>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="mt-12">
        <Button asChild variant="secondary">
          <Link href="/journal">All journal notes</Link>
        </Button>
      </div>
    </Section>
  );
}
