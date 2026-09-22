import Image from "next/image";
import Link from "next/link";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Section } from "@/design-system/components/section";
import { Reveal } from "@/design-system/components/reveal";
import { Text } from "@/design-system/components/text";
import { compact } from "@/lib/utils";
import { getDb } from "@/lib/db";
import { getPublicBlogListing } from "@/lib/blog/public";

export async function HomeJournal() {
  const listing = await getPublicBlogListing(getDb(), {});
  const posts = compact([listing.featured, ...listing.latest]).slice(0, 2);
  if (posts.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="Journal"
      title="From the group."
      intro="Published notes only — written in the CMS, never invented for the homepage."
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        {posts.map((item, index) => (
          <Reveal key={item.id} transition={{ delay: index * 0.06 }}>
            <article>
              <HoverMedia className="aspect-[16/9]">
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="bg-ink-soft h-full w-full" />
                )}
              </HoverMedia>
              <h3 className="font-display text-h3 text-cream mt-6">
                <Link href={item.href} className="transition-colors hover:text-brass">
                  {item.title}
                </Link>
              </h3>
              <Text className="mt-3">{item.excerpt}</Text>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="mt-12">
        <Button asChild variant="secondary">
          <Link href="/blog">All journal notes</Link>
        </Button>
      </div>
    </Section>
  );
}
