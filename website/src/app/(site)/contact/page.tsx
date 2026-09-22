import type { Metadata } from "next";
import { PageHero } from "@/components/marketing";
import { ContactEnquiryForm } from "@/components/forms/ContactEnquiryForm";
import { Container } from "@/design-system/components/container";
import { pageMetadataFromSeo } from "@/lib/seo/metadata";
import { publicSeo } from "@/lib/seo/pages";
import { offices } from "@/lib/content";

export const metadata: Metadata = pageMetadataFromSeo(publicSeo.contact);

export default function ContactPage() {
  return (
    <>
      <PageHero
        path="/contact"
        eyebrow="Contact"
        title="Let’s build something remarkable."
        copy="Got questions? We have answers. Reach the team that delivers infrastructure, residences, and materials."
        image="/assets/images/banners/contact.jpg"
        imageAlt="Contact Renaatus"
      />

      <Container className="grid min-w-0 gap-12 py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-8">
          {offices.map((office) => (
            <article key={office.region} className="rounded-sm border border-line bg-panel p-6 md:p-7">
              <p className="kicker">{office.role}</p>
              <h2 className="font-display mt-2 text-3xl break-words">{office.region}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{office.address}</p>
              <a
                href={`mailto:${office.email}`}
                className="text-gold mt-4 block min-h-11 break-all hover:underline"
              >
                {office.email}
              </a>
              {office.phone ? (
                <a
                  href={`tel:${office.phone.replace(/\s/g, "")}`}
                  className="mt-1 block min-h-11 text-sm"
                >
                  {office.phone}
                </a>
              ) : null}
            </article>
          ))}
        </div>
        <ContactEnquiryForm sourcePath="/contact" />
      </Container>
    </>
  );
}
