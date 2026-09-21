import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/marketing";
import { Container, MediaFrame, Text } from "@/design-system";
import { aacHighlights } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products",
  description: "Renacon AAC blocks — South India’s autoclaved aerated concrete from Renaatus.",
};

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Products"
        title="Renacon AAC blocks."
        copy="Renacon is South India’s leading brand of autoclaved aerated concrete — a new-age green wall material for faster, lighter, more sustainable building."
      />
      <Container className="grid gap-12 pb-[var(--section-y)] lg:grid-cols-2">
        <MediaFrame className="aspect-[4/3]">
          <Image
            src="/assets/images/verticals/aac-blocks.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </MediaFrame>
        <ul className="grid gap-8 content-center">
          {aacHighlights.map((item) => (
            <li key={item.title}>
              <h2 className="text-h4 font-medium text-cream">{item.title}</h2>
              <Text className="mt-2">{item.copy}</Text>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
