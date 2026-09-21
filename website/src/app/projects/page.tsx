import type { Metadata } from "next";
import Link from "next/link";
import { InfrastructureGrid, PageIntro, ProjectCard } from "@/components/marketing";
import { Container } from "@/design-system";
import { realtyProjects } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Realty and infrastructure delivered by Renaatus across India, the Maldives, and Mauritius.",
};

const filters = [
  { href: "/projects", label: "All work", type: undefined },
  { href: "/projects?type=realty", label: "Residences", type: "realty" },
  { href: "/projects?type=infrastructure", label: "Infrastructure", type: "infrastructure" },
] as const;

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const type = params.type === "realty" || params.type === "infrastructure" ? params.type : undefined;
  const showRealty = type !== "infrastructure";
  const showInfra = type !== "realty";

  return (
    <>
      <PageIntro
        eyebrow="Projects"
        title="Work across water, stone, and civic ground."
        copy="Residences in the Maldives and India, and infrastructure delivered as EPC — airports, hospitals, courts, irrigation, and housing."
      />

      <Container className="pb-8">
        <nav aria-label="Project type" className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = filter.type === type;
            return (
              <Link
                key={filter.href}
                href={filter.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "h-9 px-4 text-[0.65rem] tracking-[0.18em] uppercase border transition-colors duration-200",
                  active
                    ? "border-brass text-brass"
                    : "border-line text-cream/80 hover:border-cream/40 hover:text-cream",
                )}
              >
                {filter.label}
              </Link>
            );
          })}
        </nav>
      </Container>

      {showRealty ? (
        <section className="pb-16">
          <Container>
            <h2 className="font-display text-h2 text-cream">Residences</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          </Container>
        </section>
      ) : null}

      {showInfra ? (
        <section className="pb-[var(--section-y)]">
          <Container>
            <h2 className="font-display mb-10 text-h2 text-cream">Infrastructure</h2>
            <InfrastructureGrid />
          </Container>
        </section>
      ) : null}
    </>
  );
}
