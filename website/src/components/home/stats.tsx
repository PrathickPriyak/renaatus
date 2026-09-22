"use client";

import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { AnimatedStat } from "@/components/marketing/animated-stat";
import { stats } from "@/lib/content";

export function HomeStats() {
  return (
    <section className="border-line/80 bg-ink relative border-y">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 8% 50%, rgba(37,59,120,0.4), transparent 55%), radial-gradient(ellipse 50% 60% at 92% 40%, rgba(196,161,90,0.08), transparent 50%)",
        }}
      />
      <Container className="relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-20">
        {stats.map((item, index) => (
          <Reveal key={item.label} transition={{ delay: index * 0.06 }}>
            <AnimatedStat
              value={item.value}
              label={item.label}
              delay={index * 0.08}
            />
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
