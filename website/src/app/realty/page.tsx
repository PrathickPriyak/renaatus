import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";
import { realtyProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Realty",
  description:
    "Ultra-luxury residences by Renaatus in the Maldives and India — Irumathi, Javaahiru, Ithaa Muiy, and Skyside.",
};

export default function RealtyPage() {
  return (
    <>
      <PageHero
        eyebrow="Realty"
        title="Iconic residences. Timeless elegance."
        copy="A decade of crafting ultra-luxury homes in the Maldives — and a growing residential presence in India."
        image="/assets/images/banners/realty.jpg"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="kicker">Portfolio</p>
        <h2 className="font-display mt-4 max-w-3xl text-4xl md:text-5xl">
          Homes that become landmarks
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {realtyProjects.map((project) => (
            <ProjectCard
              key={project.name}
              title={project.name}
              meta={project.location}
              copy={project.copy}
              image={project.image}
              href={project.href}
            />
          ))}
        </div>
      </section>
    </>
  );
}
