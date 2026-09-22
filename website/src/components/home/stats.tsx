import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { stats } from "@/lib/content";

export function HomeStats() {
  return (
    <section className="border-line/80 bg-ink relative border-y">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 10% 50%, rgba(37,59,120,0.35), transparent 55%)",
        }}
      />
      <Container className="relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-20">
        {stats.map((item, index) => (
          <Reveal
            key={item.label}
            className="min-w-0 border-l border-brass/40 pl-5"
            transition={{ delay: index * 0.06 }}
          >
            <p className="font-display text-brass text-[clamp(2.5rem,4vw,3.75rem)] leading-none tracking-tight">
              {item.value}
            </p>
            <p className="text-cream-muted mt-4 max-w-[15rem] text-sm leading-6 tracking-wide">
              {item.label}
            </p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
