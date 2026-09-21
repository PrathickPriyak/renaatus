import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, ProjectCard } from "@/components/marketing";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Text } from "@/design-system/components/text";
import {
  catalogProjects,
  getProjectBySlug,
  projectHref,
  projectMeta,
} from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return catalogProjects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.name,
    description: project.copy ?? `${project.name} — a Renaatus ${project.kind} project.`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = catalogProjects
    .filter((item) => item.kind === project.kind && item.slug !== project.slug)
    .slice(0, 3);

  const stills = project.gallery.length > 1 ? project.gallery : [];

  return (
    <>
      <PageHero
        eyebrow={project.kind === "realty" ? "Residence" : "Infrastructure"}
        title={project.name}
        copy={project.copy ?? projectMeta(project)}
        image={project.image}
        breadcrumbItems={[
          { href: "/", label: "Home" },
          { href: "/projects", label: "Projects" },
          { href: `/projects/${project.slug}`, label: project.name },
        ]}
      />

      <Container className="grid gap-10 py-[var(--section-y)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">
            {projectMeta(project)}
          </p>
          {project.copy ? null : (
            <Text className="mt-6">
              Project narrative beyond the name, location, and photography is
              CONTENT_REQUIRED.
            </Text>
          )}
        </div>
        <div className="flex flex-col gap-3 lg:items-end lg:justify-end">
          {project.externalHref ? (
            <Button asChild>
              <a href={project.externalHref} target="_blank" rel="noopener noreferrer">
                Project site
              </a>
            </Button>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/contact">Enquire</Link>
          </Button>
        </div>
      </Container>

      {stills.length > 0 ? (
        <section className="bg-ink-soft py-[var(--section-y)]">
          <Container>
            <h2 className="font-display text-h2 text-cream">On the ground.</h2>
            <div className="bg-line mt-10 grid gap-px sm:grid-cols-2">
              {stills.map((src) => (
                <HoverMedia key={src} className="aspect-[4/3]">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </HoverMedia>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="py-[var(--section-y)]">
          <Container>
            <h2 className="font-display text-h2 text-cream">More in this line.</h2>
            <div className="bg-line mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard
                  key={item.slug}
                  title={item.name}
                  meta={projectMeta(item)}
                  image={item.image}
                  href={projectHref(item.slug)}
                />
              ))}
            </div>
            <Button asChild variant="secondary" className="mt-12">
              <Link href="/projects">All projects</Link>
            </Button>
          </Container>
        </section>
      ) : null}
    </>
  );
}
