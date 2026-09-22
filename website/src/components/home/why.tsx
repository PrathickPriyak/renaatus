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
      <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
        {pillars.map((item, index) => (
          <Reveal key={item.title} transition={{ delay: index * 0.05 }}>
            <article className="border-line/80 bg-ink group h-full border p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-brass/35 md:p-10">
              <p className="text-brass font-display text-3xl leading-none opacity-50 transition-opacity duration-500 group-hover:opacity-90">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-h3 text-cream mt-6">{item.title}</h3>
              <Text className="mt-4">{item.copy}</Text>
              <ul className="text-cream/75 mt-8 space-y-3 text-sm leading-6">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="bg-brass mt-2.5 h-px w-4 shrink-0 transition-all duration-500 group-hover:w-6" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="mt-14">
        <Button asChild variant="secondary">
          <Link href="/why-renaatus">Why Renaatus</Link>
        </Button>
      </div>
    </Section>
  );
}
