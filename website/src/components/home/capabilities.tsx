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
      width="wide"
    >
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        {verticals.map((item, index) => (
          <Reveal key={item.title} transition={{ delay: index * 0.08 }}>
            <Link href={item.href} className="group lift block h-full">
              <HoverMedia className="aspect-[3/4] rounded-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,rgba(7,9,14,0.55)_58%,rgba(7,9,14,0.95)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-7 transition-transform duration-500 group-hover:-translate-y-1 md:p-8">
                  <p className="text-eyebrow text-brass tracking-[0.28em] uppercase">
                    {item.kicker}
                  </p>
                  <h3 className="font-display text-cream mt-3 text-[clamp(1.5rem,2vw,1.85rem)]">
                    {item.title}
                  </h3>
                  <p className="text-cream/75 mt-4 max-w-sm text-sm leading-7">
                    {item.copy}
                  </p>
                  <span className="text-brass mt-6 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase">
                    Explore
                    <span
                      aria-hidden
                      className="bg-brass h-px w-5 transition-all duration-500 group-hover:w-9"
                    />
                  </span>
                </div>
              </HoverMedia>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
