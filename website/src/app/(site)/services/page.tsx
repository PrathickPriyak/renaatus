import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/marketing";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceListJsonLd } from "@/lib/seo/json-ld";
import { pageMetadataFromSeo } from "@/lib/seo/metadata";
import { publicSeo } from "@/lib/seo/pages";
import { verticals } from "@/lib/content";

export const metadata: Metadata = pageMetadataFromSeo(publicSeo.services);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={serviceListJsonLd()} />
      <PageIntro
        path="/services"
        eyebrow="Services"
        title="Manufacturer and builder in one group."
        copy="Three lines of work — infrastructure as EPC, residences, and Renacon AAC — drawn from what the company already delivers. Further service lines are CONTENT_REQUIRED."
      />

      <Section>
        <div className="bg-line grid gap-px lg:grid-cols-3">
          {verticals.map((item, index) => (
            <Reveal key={item.title} transition={{ delay: index * 0.06 }}>
              <Link href={item.href} className="group bg-ink block">
                <HoverMedia className="aspect-[4/5]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="from-ink via-ink/30 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">
                      {item.kicker}
                    </p>
                    <h2 className="font-display text-h3 text-cream mt-3">{item.title}</h2>
                    <p className="text-cream/80 mt-3 max-w-sm text-sm leading-6">
                      {item.copy}
                    </p>
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
