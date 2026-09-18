import Image from "next/image";

type ProjectCardProps = {
  title: string;
  meta?: string;
  copy?: string;
  image: string;
  href?: string;
};

export function ProjectCard({ title, meta, copy, image, href }: ProjectCardProps) {
  const inner = (
    <article className="group lift media-frame aspect-[4/5] rounded-2xl">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        {meta ? <p className="kicker mb-2">{meta}</p> : null}
        <h3 className="font-display text-2xl leading-tight">{title}</h3>
        {copy ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-cream/80">{copy}</p> : null}
      </div>
    </article>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {inner}
      </a>
    );
  }

  return inner;
}
