import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { stats } from "@/lib/content";

export function HomeStats() {
  return (
    <section className="border-line bg-ink border-y">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        {stats.map((item, index) => (
          <Reveal
            key={item.label}
            className="min-w-0"
            transition={{ delay: index * 0.06 }}
          >
            <p className="font-display text-display text-brass">{item.value}</p>
            <p className="text-cream-muted mt-3 max-w-[14rem] text-sm leading-6">
              {item.label}
            </p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
