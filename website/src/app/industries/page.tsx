import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/marketing";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { projectHref } from "@/lib/catalog";
import { industries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Sectors drawn from work Renaatus has already delivered — aviation, healthcare, water, transport, civic buildings, and residences.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Industries"
        title="Sectors we have already built in."
        copy="This list is derived from delivered projects. It is not a speculative market map."
      />

      <Section>
        <div className="bg-line grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item, index) => (
            <Reveal key={item.title} transition={{ delay: index * 0.04 }}>
              <Link href={projectHref(item.featuredSlug)} className="group bg-ink block">
                <HoverMedia className="aspect-[5/4]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="from-ink via-ink/40 to-ink/15 absolute inset-0 bg-gradient-to-t" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <h2 className="font-display text-h4 text-cream">{item.title}</h2>
                    <p className="text-caption text-cream/75 mt-2">{item.works}</p>
                  </div>
                </HoverMedia>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
