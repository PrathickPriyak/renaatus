"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { infrastructureProjects, type InfraProject } from "@/lib/content";

const filters = ["All", "India", "Maldives", "Mauritius"] as const;
type Filter = (typeof filters)[number];

export function InfrastructureGrid() {
  const [filter, setFilter] = useState<Filter>("All");

  const projects = useMemo(() => {
    if (filter === "All") {
      return infrastructureProjects;
    }
    return infrastructureProjects.filter((project: InfraProject) => project.country === filter);
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
              className={`rounded-full border px-4 py-2 text-xs tracking-[0.16em] uppercase transition ${
                active
                  ? "border-brand bg-brand text-white"
                  : "border-white/15 text-cream/80 hover:border-gold hover:text-gold"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            title={project.name}
            meta={`${project.country}${project.year ? ` · ${project.year}` : ""}`}
            image={project.image}
          />
        ))}
      </div>
    </div>
  );
}
