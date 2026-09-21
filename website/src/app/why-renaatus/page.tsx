import type { Metadata } from "next";
import { PageIntro } from "@/components/marketing";
import { Container, Text } from "@/design-system";
import { pillars } from "@/lib/content";

export const metadata: Metadata = {
  title: "Why Renaatus",
  description: "Manufacturer and builder — expertise, footprint, and purpose.",
};

export default function WhyRenaatusPage() {
  return (
    <>
      <PageIntro
        eyebrow="Why Renaatus"
        title="Manufacturer and builder."
        copy="The same group that makes Renacon AAC also delivers the work on site — across India, the Maldives, and Mauritius."
      />
      <Container className="grid gap-12 pb-[var(--section-y)] md:grid-cols-2">
        {pillars.map((item) => (
          <article key={item.title} className="border-t border-line pt-8">
            <h2 className="font-display text-h3 text-cream">{item.title}</h2>
            <Text className="mt-4">{item.copy}</Text>
            <ul className="mt-6 space-y-2 text-sm text-cream/80">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </Container>
    </>
  );
}
