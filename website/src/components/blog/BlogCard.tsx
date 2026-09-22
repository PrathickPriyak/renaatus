import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";
import { formatBlogDate, type PublicBlogCard } from "@/lib/blog/public";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: PublicBlogCard;
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const dateLabel = post.publishedAt ? formatBlogDate(post.publishedAt) : null;
  const meta = [post.category?.name, dateLabel].filter(Boolean).join(" · ");

  return (
    <article className={cn(featured ? "grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end" : "")}>
      <Link href={post.href} className="group block">
        <HoverMedia className={featured ? "aspect-[16/9] lg:aspect-[5/3]" : "aspect-[16/9]"}>
          {post.image ? (
            <Image
              src={post.image.src}
              alt={post.image.alt || post.title}
              fill
              className="object-cover"
              sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 100vw, 50vw"}
              priority={featured}
            />
          ) : (
            <div className="bg-ink-soft h-full w-full" />
          )}
        </HoverMedia>
      </Link>
      <div>
        {meta ? (
          <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">{meta}</p>
        ) : null}
        <h2 className={cn("font-display text-cream mt-3 break-words", featured ? "text-h2" : "text-h3")}>
          <Link href={post.href} className="transition-colors hover:text-brass">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-prose text-body text-cream-muted">{post.excerpt}</p>
        <Link
          href={post.href}
          className="text-caption text-brass mt-5 inline-flex min-h-11 items-center tracking-[0.12em] uppercase"
        >
          Read note
        </Link>
      </div>
    </article>
  );
}
