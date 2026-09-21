import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/marketing";
import { Container, MediaFrame } from "@/design-system";
import { news } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from Renaatus — CMRL partnership and SAP go-live.",
};

export default function JournalPage() {
  return (
    <>
      <PageIntro
        eyebrow="Journal"
        title="From the group."
        copy="Published notes only. No invented headlines."
      />
      <Container className="grid gap-10 pb-[var(--section-y)] lg:grid-cols-2">
        {news.map((item) => (
          <article key={item.title}>
            <MediaFrame className="aspect-[16/9]">
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </MediaFrame>
            <h2 className="font-display mt-6 text-h3 text-cream">{item.title}</h2>
            <p className="mt-3 max-w-prose text-body text-cream-muted">{item.copy}</p>
          </article>
        ))}
      </Container>
    </>
  );
}
