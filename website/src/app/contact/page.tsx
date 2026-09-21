import type { Metadata } from "next";
import { PageHero } from "@/components/marketing";
import { ContactEnquiryForm } from "@/components/forms/ContactEnquiryForm";
import { offices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Renaatus in Chennai, Maldives, and Mauritius.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s build something remarkable."
        copy="Got questions? We have answers. Reach the team that delivers infrastructure, residences, and materials."
        image="/assets/images/banners/contact.jpg"
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] md:px-8">
        <div className="space-y-8">
          {offices.map((office) => (
            <article key={office.region} className="rounded-sm border border-line bg-panel p-7">
              <p className="kicker">{office.role}</p>
              <h2 className="font-display mt-2 text-3xl">{office.region}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{office.address}</p>
              <a href={`mailto:${office.email}`} className="mt-4 block text-gold hover:underline">
                {office.email}
              </a>
              {office.phone ? (
                <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm">
                  {office.phone}
                </a>
              ) : null}
            </article>
          ))}
        </div>
        <ContactEnquiryForm sourcePath="/contact" />
      </section>
    </>
  );
}
