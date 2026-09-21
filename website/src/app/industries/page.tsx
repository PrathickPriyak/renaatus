import type { Metadata } from "next";
import { PageIntro } from "@/components/marketing";
import { Container, Text } from "@/design-system";
import { industries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries",
  description: "Sectors drawn from work Renaatus has already delivered.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Industries"
        title="Sectors we have already built in."
        copy="This list is derived from delivered projects. It is not a speculative market map."
      />
      <Container className="grid gap-10 pb-[var(--section-y)] md:grid-cols-2">
        {industries.map((item) => (
          <article key={item.title} className="border-line border-t pt-6">
            <h2 className="text-h4 text-cream font-medium">{item.title}</h2>
            <Text className="mt-3">{item.works}</Text>
          </article>
        ))}
      </Container>
    </>
  );
}
