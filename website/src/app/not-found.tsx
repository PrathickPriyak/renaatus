import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/404",
  title: "Page not found",
  description: "This path does not exist on the Renaatus website.",
  index: false,
});

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
      <p className="kicker">404</p>
      <h1 className="font-display mt-4 text-5xl">This page has not been built yet.</h1>
      <p className="mt-4 max-w-md text-muted">The path you requested does not exist. Return home or browse our work.</p>
      <Link href="/" className="mt-8 rounded-full bg-brand px-6 py-3 text-sm tracking-[0.14em] uppercase text-white">
        Back to home
      </Link>
    </section>
  );
}
