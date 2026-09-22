import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Section } from "@/design-system/components/section";
import { Reveal } from "@/design-system/components/reveal";
import { infrastructureProjects, realtyProjects } from "@/lib/content";
import { projectHref, slugify } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function infra(name: string) {
  const project = infrastructureProjects.find((item) => item.name === name);
  if (!project) return null;
  return {
    title: project.name,
    meta: `${project.country}${project.year ? ` · ${project.year}` : ""}`,
    image: project.image,
    href: projectHref(slugify(project.name)),
    copy: project.copy,
  };
}

function realty(name: string) {
  const project = realtyProjects.find((item) => item.name === name);
  if (!project) return null;
  return {
    title: project.name,
    meta: project.location,
    image: project.image,
    href: projectHref(slugify(project.name)),
    copy: project.copy,
  };
}

const featured = [
  { item: realty("Renaatus Irumathi"), span: "wide" as const },
  { item: infra("Rajahmundry Domestic Airport"), span: "tall" as const },
  { item: infra("Supreme Court of Mauritius"), span: "half" as const },
  { item: realty("Renaatus Ithaa Muiy"), span: "half" as const },
].filter((entry): entry is { item: NonNullable<ReturnType<typeof realty>>; span: "wide" | "tall" | "half" } =>
  Boolean(entry.item),
);

export function HomeFeatured() {
  return (
    <Section
      tone="soft"
      eyebrow="Selected work"
      title="Places already on the ground."
      intro="Residences and civic works delivered across the Indian Ocean — photographed where they stand."
      width="wide"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {featured.map(({ item, span }, index) => {
          const col =
            span === "wide"
              ? "lg:col-span-8"
              : span === "tall"
                ? "lg:col-span-4"
                : "lg:col-span-6";
          const aspect = span === "wide" ? "aspect-[16/10]" : "aspect-[4/5]";
          return (
            <Reveal
              key={item.title}
              className={cn("min-w-0", col)}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href} className="group lift block">
                <HoverMedia className={cn(aspect, "rounded-sm")}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 42vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_28%,rgba(7,9,14,0.55)_68%,rgba(7,9,14,0.94)_100%)] transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-1 p-6 transition-transform duration-500 group-hover:translate-y-0 md:p-9">
                    <p className="text-eyebrow text-brass tracking-[0.28em] uppercase">
                      {item.meta}
                    </p>
                    <h3 className="font-display text-cream mt-3 text-[clamp(1.35rem,2.2vw,2rem)] leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-cream/75 mt-3 max-w-md text-sm leading-relaxed opacity-90 transition-opacity duration-500 md:text-[0.95rem] md:opacity-0 md:group-hover:opacity-100">
                      {item.copy}
                    </p>
                    <span className="text-brass mt-5 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase opacity-0 transition-all duration-500 group-hover:opacity-100">
                      View project
                      <span aria-hidden className="bg-brass h-px w-6 transition-all duration-500 group-hover:w-10" />
                    </span>
                  </div>
                </HoverMedia>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-14">
        <Button asChild variant="secondary">
          <Link href="/projects">View all projects</Link>
        </Button>
      </div>
    </Section>
  );
}
