import type { Metadata } from "next";
import { InfrastructureGrid, PageHero } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "Airports, courts, hospitals, irrigation, and housing — Renaatus EPC projects across India, Maldives, and Mauritius.",
};

export default function InfrastructurePage() {
  return (
    <>
      <PageHero
        eyebrow="Infrastructure"
        title="Trusted to deliver ambitious civic visions."
        copy="Airport terminals, Supreme Court offices, industrial corridors, medical campuses, and social housing — built to last."
        image="/assets/images/banners/infrastructure.jpg"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="kicker">Selected works</p>
        <h2 className="font-display mt-4 mb-12 max-w-3xl text-4xl md:text-5xl">
          Landmark projects across three countries
        </h2>
        <InfrastructureGrid />
      </section>
    </>
  );
}
