import Image from "next/image";
import { Breadcrumb } from "@/design-system";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
};

export function PageHero({ eyebrow, title, copy, image }: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[62vh] overflow-hidden grain">
      <Image src={image} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8">
        <Breadcrumb className="mb-8" />
        <p className="kicker fade-up">{eyebrow}</p>
        <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[1.05] md:text-7xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-cream/80 md:text-lg">{copy}</p>
      </div>
    </section>
  );
}
