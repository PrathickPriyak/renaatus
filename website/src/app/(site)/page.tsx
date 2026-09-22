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
import { pageMetadataFromSeo } from "@/lib/seo/metadata";
import { publicSeo } from "@/lib/seo/pages";

export const revalidate = 300;

export const metadata: Metadata = pageMetadataFromSeo(publicSeo.home);

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeStats />
      <HomeIntro />
      <HomeCapabilities />
      <HomeFeatured />
      <HomeSolutions />
      <HomeWhy />
      <HomeIndustries />
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
