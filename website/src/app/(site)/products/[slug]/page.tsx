import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductEnquiryForm } from "@/components/forms/ProductEnquiryForm";
import { PageIntro } from "@/components/marketing";
import { HoverMedia } from "@/components/marketing/hover-media";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Heading } from "@/design-system/components/heading";
import { Text } from "@/design-system/components/text";
import { getProductBySlug, products } from "@/lib/catalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { productJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product", robots: { index: false, follow: false } };
  }
  return pageMetadata({
    path: `/products/${product.slug}`,
    title: product.name,
    description: product.copy,
    image: product.image,
    imageAlt: product.name,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <PageIntro
        path={`/products/${product.slug}`}
        eyebrow={product.kicker}
        title={product.name}
        copy={product.copy}
        breadcrumbItems={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { href: `/products/${product.slug}`, label: product.name },
        ]}
      />

      <Container className="grid gap-12 pb-16 lg:grid-cols-2">
        <ul className="grid content-start gap-8">
          {product.highlights.map((item) => (
            <li key={item.title} className="border-brass border-l pl-5">
              <h2 className="text-h4 text-cream font-medium">{item.title}</h2>
              <Text className="mt-2">{item.copy}</Text>
            </li>
          ))}
        </ul>
        <div className="bg-line grid grid-cols-2 gap-px">
          {product.stills.map((src, index) => (
            <HoverMedia key={src} className="aspect-square">
              <Image
                src={src}
                alt={`${product.name} photography, still ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </HoverMedia>
          ))}
        </div>
      </Container>

      <Container className="flex flex-wrap gap-3 pb-12">
        <Button asChild>
          <a href="#enquiry">Enquire</a>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/products">All products</Link>
        </Button>
      </Container>

      <Container id="enquiry" className="grid scroll-mt-28 gap-8 pb-[var(--section-y)] lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Heading variant="h2">Enquire about {product.name}.</Heading>
          <Text className="mt-4">
            Tell us about quantities, delivery location, and programme. The business development team will respond shortly.
          </Text>
        </div>
        <ProductEnquiryForm productSlug={product.slug} productName={product.name} />
      </Container>
    </>
  );
}
