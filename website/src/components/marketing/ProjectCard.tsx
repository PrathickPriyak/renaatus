import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";

type ProjectCardProps = {
  title: string;
  meta?: string;
  copy?: string;
  image: string;
  href?: string;
};

export function ProjectCard({ title, meta, copy, image, href }: ProjectCardProps) {
  const inner = (
    <article className="group block">
      <HoverMedia className="aspect-[4/5]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="from-ink via-ink/25 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          {meta ? (
            <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">{meta}</p>
          ) : null}
          <h3 className="font-display text-h3 text-cream mt-2 leading-tight">{title}</h3>
          {copy ? (
            <p className="text-cream/80 mt-2 line-clamp-3 text-sm leading-6">{copy}</p>
          ) : null}
        </div>
      </HoverMedia>
    </article>
  );

  if (!href) return inner;

  const external = href.startsWith("http");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <Link href={href}>{inner}</Link>;
}
