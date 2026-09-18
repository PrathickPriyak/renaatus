import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers at Renaatus — join a team building infrastructure, residences, and green materials.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a career with lasting impact."
        copy="Unlock your potential with work that inspires growth, innovation, and excellence — across India, Maldives, and Mauritius."
        image="/assets/images/banners/careers.jpg"
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <p className="kicker">Join us</p>
          <h2 className="font-display mt-4 text-4xl">Current openings</h2>
          <p className="mt-5 text-base leading-8 text-cream/80">
            Send your profile to our people team. We review every application and will be in touch when a role matches your experience.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <p>
              HR:{" "}
              <a className="text-gold hover:underline" href="mailto:hr@renaatus.com">
                hr@renaatus.com
              </a>
            </p>
            <p>
              Recruitment:{" "}
              <a className="text-gold hover:underline" href="mailto:recruitment@renaatus.com">
                recruitment@renaatus.com
              </a>
            </p>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
