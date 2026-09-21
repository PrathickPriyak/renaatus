import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Section } from "@/design-system/components/section";
import { Reveal } from "@/design-system/components/reveal";
import { verticals } from "@/lib/content";

export function HomeCapabilities() {
  return (
    <Section
      tone="soft"
      eyebrow="Capabilities"
      title="Three lines. One standard."
      intro="EPC infrastructure, luxury residences, and Renacon AAC — manufacturer and builder in the same group."
    >
      <div className="bg-line grid gap-px lg:grid-cols-3">
        {verticals.map((item, index) => (
          <Reveal key={item.title} transition={{ delay: index * 0.08 }}>
            <Link href={item.href} className="group bg-ink-soft block">
              <HoverMedia className="aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="from-ink via-ink/25 absolute inset-0 bg-gradient-to-t to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">
                    {item.kicker}
                  </p>
                  <h3 className="font-display text-h3 text-cream mt-3">{item.title}</h3>
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
  );
}
