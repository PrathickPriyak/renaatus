import type { Metadata } from "next";
import {
  HomeCapabilities,
  HomeFeatured,
  HomeHero,
  HomeIndustries,
  HomeIntro,
  HomeJournal,
  HomeSolutions,
  HomeStats,
  HomeStory,
  HomeWhy,
} from "@/components/home";
import { CtaBand } from "@/design-system";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Renaatus | Building foundations across borders",
  },
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeIntro />
      <HomeCapabilities />
      <HomeSolutions />
      <HomeFeatured />
      <HomeIndustries />
      <HomeWhy />
      <HomeStats />
      <HomeStory />
      <HomeJournal />
      <CtaBand
        eyebrow="Enquire"
        title="Start a conversation."
        copy="Reach the team that delivers infrastructure, residences, and materials across India, the Maldives, and Mauritius."
      />
    </>
  );
}
