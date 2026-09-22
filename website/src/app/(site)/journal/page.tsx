import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/journal",
  title: "Journal archive",
  description: "The Renaatus journal now publishes at /blog.",
  index: false,
  canonical: "/blog",
});

export default function JournalRedirectPage() {
  redirect("/blog");
}
