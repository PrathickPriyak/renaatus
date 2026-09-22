import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/infrastructure",
  title: "Infrastructure archive",
  description:
    "The Renaatus infrastructure portfolio now lives under Projects — airports, courts, hospitals, and civic works.",
  index: false,
  canonical: "/projects?type=infrastructure",
});

export default function InfrastructurePage() {
  redirect("/projects?type=infrastructure");
}
