import type { Metadata } from "next";
import { PageIntro } from "@/components/marketing";
import { Container, Text } from "@/design-system";

export const metadata: Metadata = {
  title: "Industries",
  description: "Sectors drawn from work Renaatus has already delivered.",
};

const industries = [
  {
    title: "Aviation",
    works: "Rajahmundry Domestic Airport; GAN International Airport.",
  },
  {
    title: "Healthcare and campuses",
    works: "JIPMER Karaikal; Tiruppur Medical College and Hospital; IGMH; NIT-E Karaikal.",
  },
  {
    title: "Water and irrigation",
    works: "GA Canal; Rajavaikal, Kumarapalayam; Mettur East Bank Canal, Salem.",
  },
  {
    title: "Transport",
    works: "SH-95 Mohanur; Perungalathur Grade Separator; Pollachi–Podanur ROB.",
  },
  {
    title: "Civic and justice",
    works: "Supreme Court of Mauritius.",
  },
  {
    title: "Residential",
    works: "Maldives residences, social housing, and Vilankurichi, Coimbatore.",
  },
] as const;

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
          <article key={item.title} className="border-t border-line pt-6">
            <h2 className="text-h4 font-medium text-cream">{item.title}</h2>
            <Text className="mt-3">{item.works}</Text>
          </article>
        ))}
      </Container>
    </>
  );
}
