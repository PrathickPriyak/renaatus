import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Section } from "@/design-system/components/section";
import { Reveal } from "@/design-system/components/reveal";
import { infrastructureProjects, realtyProjects } from "@/lib/content";
import { cn } from "@/lib/utils";

function infra(name: string) {
  const project = infrastructureProjects.find((item) => item.name === name);
  if (!project) {
    return {
      title: "CONTENT_REQUIRED",
      meta: "CONTENT_REQUIRED",
      image: "/assets/images/banners/infrastructure.jpg",
      href: "/projects",
    };
  }
  return {
    title: project.name,
    meta: `${project.country}${project.year ? ` · ${project.year}` : ""}`,
    image: project.image,
    href: "/projects?type=infrastructure",
  };
}

function realty(name: string) {
  const project = realtyProjects.find((item) => item.name === name);
  if (!project) {
    return {
      title: "CONTENT_REQUIRED",
      meta: "CONTENT_REQUIRED",
      image: "/assets/images/banners/realty.jpg",
      href: "/projects",
    };
  }
  return {
    title: project.name,
    meta: project.location,
    image: project.image,
    href: project.href ?? "/projects?type=realty",
  };
}

const featured = [
  { ...realty("Renaatus Irumathi"), span: "wide" as const },
  { ...infra("Rajahmundry Domestic Airport"), span: "tall" as const },
  { ...infra("Supreme Court of Mauritius"), span: "half" as const },
  { ...realty("Renaatus Ithaa Muiy"), span: "half" as const },
];

export function HomeFeatured() {
  return (
    <Section
      tone="soft"
      eyebrow="Selected work"
      title="Places already on the ground."
      intro="A short set from residences and civic works — not a catalogue, and not a promise of inventory."
    >
      <div className="bg-line grid gap-px md:grid-cols-2 lg:grid-cols-12">
        {featured.map((item, index) => {
          const span =
            item.span === "wide"
              ? "lg:col-span-8"
              : item.span === "tall"
                ? "lg:col-span-4"
                : "lg:col-span-6";
          const aspect = item.span === "wide" ? "aspect-[16/10]" : "aspect-[4/5]";
          const external = item.href.startsWith("http");
          return (
            <Reveal
              key={item.title}
              className={cn("min-w-0", span)}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group bg-ink-soft block"
              >
                <HoverMedia className={aspect}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 42vw"
                  />
                  <div className="from-ink via-ink/20 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">
                      {item.meta}
                    </p>
                    <h3 className="font-display text-h3 text-cream mt-3">{item.title}</h3>
                  </div>
                </HoverMedia>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-12">
        <Button asChild variant="secondary">
          <Link href="/projects">All projects</Link>
        </Button>
      </div>
    </Section>
  );
}
