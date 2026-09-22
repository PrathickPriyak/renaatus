import type { Metadata } from "next";
import { PageIntro } from "@/components/marketing";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Text } from "@/design-system/components/text";
import { Container } from "@/design-system/components/container";
import { pillars, stats, testimonials } from "@/lib/content";

import { pageMetadataFromSeo } from "@/lib/seo/metadata";
import { publicSeo } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadataFromSeo(publicSeo.whyRenaatus);

export default function WhyRenaatusPage() {
  return (
    <>
      <PageIntro
        path="/why-renaatus"
        eyebrow="Why Renaatus"
        title="Manufacturer and builder."
        copy="The same group that makes Renacon AAC also delivers the work on site — across India, the Maldives, and Mauritius."
      />

      <section className="border-line bg-ink border-y">
        <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {stats.map((item, index) => (
            <Reveal
              key={item.label}
              className="min-w-0"
              transition={{ delay: index * 0.05 }}
            >
              <p className="font-display text-display text-brass">{item.value}</p>
              <p className="text-cream-muted mt-3 max-w-[14rem] text-sm leading-6">
                {item.label}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      <Section
        tone="soft"
        title="Four reasons the work holds together."
        intro="These pillars are the group’s published account of how it operates — expertise, integration, footprint, and purpose."
      >
        <div className="bg-line grid gap-px md:grid-cols-2">
          {pillars.map((item, index) => (
            <Reveal key={item.title} transition={{ delay: index * 0.05 }}>
              <article className="bg-ink-soft h-full p-7 md:p-10">
                <h2 className="font-display text-h3 text-cream">{item.title}</h2>
                <Text className="mt-4">{item.copy}</Text>
                <ul className="text-cream/80 mt-6 space-y-2 text-sm">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="bg-brass mt-2 h-px w-3 shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="From residents"
        title="Notes already on record."
        intro="Published homeowner comments from Maldives residences. They are not a substitute for a full references list."
      >
        <div className="grid gap-10 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} transition={{ delay: index * 0.05 }}>
              <blockquote className="border-line h-full border-t pt-6">
                <p className="text-body text-cream/85 leading-7">“{item.quote}”</p>
                <footer className="mt-6">
                  <p className="font-display text-h4 text-cream">{item.name}</p>
                  <p className="text-caption text-brass mt-1">
                    {item.place} · {item.project}
                  </p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
