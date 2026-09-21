import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Section } from "@/design-system/components/section";
import { Reveal } from "@/design-system/components/reveal";
import { industries } from "@/lib/content";

export function HomeIndustries() {
  return (
    <Section
      eyebrow="Industries"
      title="Sectors we have already built in."
      intro="Drawn from delivered work — aviation, healthcare, water, transport, civic buildings, and residences."
    >
      <div className="bg-line grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((item, index) => (
          <Reveal key={item.title} transition={{ delay: index * 0.04 }}>
            <Link href="/industries" className="group bg-ink block">
              <HoverMedia className="aspect-[5/4]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="bg-ink/45 group-hover:bg-ink/30 absolute inset-0 transition-colors duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3 className="font-display text-h4 text-cream">{item.title}</h3>
                  <p className="text-caption text-cream/75 mt-2">{item.works}</p>
                </div>
              </HoverMedia>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
