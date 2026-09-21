import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/marketing";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Text } from "@/design-system/components/text";
import { getProductBySlug } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Renacon AAC blocks — South India’s autoclaved aerated concrete from Renaatus.",
};

export default function ProductsPage() {
  const product = getProductBySlug("renacon-aac-blocks");

  if (!product) {
    return (
      <PageIntro eyebrow="Products" title="CONTENT_REQUIRED" copy="CONTENT_REQUIRED" />
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Products"
        title="Renacon AAC blocks."
        copy="The published catalogue today is one line: autoclaved aerated concrete from the group that also builds. Further SKUs are CONTENT_REQUIRED until classified."
      />

      <Container className="grid gap-12 pb-[var(--section-y)] lg:grid-cols-2 lg:items-center">
        <Reveal>
          <HoverMedia className="aspect-[4/3]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </HoverMedia>
        </Reveal>
        <Reveal>
          <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">
            {product.kicker}
          </p>
          <h2 className="font-display text-h2 text-cream mt-4">{product.name}</h2>
          <Text className="mt-5">{product.copy}</Text>
          <ul className="mt-10 grid gap-8">
            {product.highlights.map((item) => (
              <li key={item.title} className="border-brass border-l pl-5">
                <h3 className="text-h4 text-cream font-medium">{item.title}</h3>
                <Text className="mt-2">{item.copy}</Text>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/products/${product.slug}`}>View product</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`/products/${product.slug}#enquiry`}>Enquire</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
