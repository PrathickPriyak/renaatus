"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { catalogProjects, projectHref, projectMeta } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const filters = ["All", "India", "Maldives", "Mauritius"] as const;
type Filter = (typeof filters)[number];

export function InfrastructureGrid() {
  const [filter, setFilter] = useState<Filter>("All");

  const projects = useMemo(() => {
    const infra = catalogProjects.filter((project) => project.kind === "infrastructure");
    if (filter === "All") return infra;
    return infra.filter((project) => project.country === filter);
  }, [filter]);

  return (
    <div>
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Filter by country">
        {filters.map((item) => {
          const active = item === filter;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(item)}
              className={cn(
                "h-9 border px-4 text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-200",
                active
                  ? "border-brass text-brass"
                  : "border-line text-cream/80 hover:border-cream/40 hover:text-cream",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="bg-line mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.name}
            meta={projectMeta(project)}
            image={project.image}
            href={projectHref(project.slug)}
          />
        ))}
      </div>
    </div>
  );
}
