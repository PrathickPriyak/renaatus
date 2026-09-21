import Link from "next/link";
import { Button } from "@/design-system/components/button";
import { Section } from "@/design-system/components/section";
import { Reveal } from "@/design-system/components/reveal";
import { Text } from "@/design-system/components/text";
import { pillars } from "@/lib/content";

export function HomeWhy() {
  return (
    <Section
      tone="soft"
      eyebrow="Why Renaatus"
      title="Manufacturer and builder."
      intro="Site experience and AAC manufacturing in the same group — across India, the Maldives, and Mauritius."
    >
      <div className="bg-line grid gap-px md:grid-cols-2">
        {pillars.map((item, index) => (
          <Reveal key={item.title} transition={{ delay: index * 0.05 }}>
            <article className="bg-ink-soft h-full p-7 md:p-10">
              <h3 className="font-display text-h3 text-cream">{item.title}</h3>
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
      <div className="mt-12">
        <Button asChild variant="secondary">
          <Link href="/why-renaatus">Why Renaatus</Link>
        </Button>
      </div>
    </Section>
  );
}
