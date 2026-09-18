import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/marketing";
import { leadership } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Renaatus — vision, mission, and the people leading a 50-year construction legacy.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A square foot for everyone. Space for every dream."
        copy="With one million square feet in our sights, we begin with Renaatus Realty — shaping lives, building communities, and turning possibility into place."
        image="/assets/images/about/about-renaatus.jpg"
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-2 md:px-8">
        <article className="rounded-3xl border border-white/10 bg-panel p-8 md:p-12">
          <p className="kicker">Vision</p>
          <h2 className="font-display mt-4 text-3xl md:text-4xl">Inspiring, purposeful spaces for all</h2>
          <p className="mt-5 text-base leading-8 text-cream/80">
            To create a world where everyone has access to inspiring and purposeful spaces. Every square foot holds the power to shape dreams, build communities, and transform lives.
          </p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-panel p-8 md:p-12">
          <p className="kicker">Mission</p>
          <h2 className="font-display mt-4 text-3xl md:text-4xl">Integrity, innovation, sustainability</h2>
          <p className="mt-5 text-base leading-8 text-cream/80">
            Driven by the vision of developing one million square feet, we are committed to meaningful, accessible, high-quality spaces — ensuring every square foot we develop serves a greater purpose.
          </p>
        </article>
      </section>

      <section className="bg-ink-soft py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="kicker">The group</p>
          <h2 className="font-display mt-4 text-4xl md:text-5xl">Four ways we show up</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: "/assets/images/about/grid-1.png", label: "Projects" },
              { src: "/assets/images/about/grid-2.png", label: "People" },
              { src: "/assets/images/about/grid-3.png", label: "Places" },
              { src: "/assets/images/about/grid-4.png", label: "Purpose" },
            ].map((item) => (
              <div key={item.label} className="media-frame aspect-[4/5] rounded-2xl">
                <Image src={item.src} alt={item.label} fill className="object-cover" sizes="300px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="kicker">Key people</p>
        <h2 className="font-display mt-4 text-4xl md:text-5xl">Leadership</h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {leadership.map((person) => (
            <article key={person.name} className="grid gap-6 rounded-3xl border border-white/10 bg-panel p-6 md:grid-cols-[200px_1fr] md:p-8">
              <div className="media-frame mx-auto aspect-[3/4] w-full max-w-[220px] rounded-2xl bg-black">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover object-top"
                  sizes="220px"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="kicker">{person.role}</p>
                <h3 className="font-display mt-2 text-3xl">{person.name}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{person.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
