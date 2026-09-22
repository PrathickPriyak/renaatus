import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/realty",
  title: "Realty",
  description:
    "The Renaatus realty portfolio now lives under Projects — residences in the Maldives and India.",
  index: false,
  canonical: "/projects?type=realty",
});

export default function RealtyPage() {
  redirect("/projects?type=realty");
}
