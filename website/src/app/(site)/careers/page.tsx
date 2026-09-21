import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing";
import { HoverMedia } from "@/components/marketing/hover-media";
import { CareerApplicationForm } from "@/components/forms/CareerApplicationForm";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { Reveal } from "@/design-system/components/reveal";
import { Section } from "@/design-system/components/section";
import { Text } from "@/design-system/components/text";
import { company, offices, stats, verticals } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Renaatus — infrastructure, luxury residences, and Renacon AAC across India, the Maldives, and Mauritius.",
};

const peopleContacts = [
  { label: "HR", email: "hr@renaatus.com" },
  { label: "Recruitment", email: "recruitment@renaatus.com" },
] as const;

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a career with lasting impact."
        copy="Work that spans infrastructure, residences, and green materials — across India, the Maldives, and Mauritius."
        image="/assets/images/banners/careers.jpg"
      />

      <Section
        tone="soft"
        eyebrow="Why Renaatus"
        title="Purpose you can point to on a map."
        intro="Drawn from the group’s published vision and mission — not a rewritten manifesto, and not a list of openings we do not publish here."
      >
        <div className="bg-line grid gap-px md:grid-cols-2">
          <Reveal>
            <article className="bg-ink-soft h-full p-7 md:p-10">
              <h2 className="font-display text-h3 text-cream">{company.visionTitle}</h2>
              <Text className="mt-4">{company.vision}</Text>
            </article>
          </Reveal>
          <Reveal transition={{ delay: 0.06 }}>
            <article className="bg-ink-soft h-full p-7 md:p-10">
              <h2 className="font-display text-h3 text-cream">{company.missionTitle}</h2>
              <Text className="mt-4">{company.mission}</Text>
            </article>
          </Reveal>
        </div>
      </Section>

      <section className="border-line bg-ink border-y">
        <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {stats.map((item, index) => (
            <Reveal key={item.label} className="min-w-0" transition={{ delay: index * 0.05 }}>
              <p className="font-display text-display text-brass">{item.value}</p>
              <p className="text-cream-muted mt-3 max-w-[14rem] text-sm leading-6">{item.label}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      <Section
        eyebrow="Where teams work"
        title="Three lines. One group."
        intro="Applications are reviewed against the work the company already delivers — EPC infrastructure, luxury residences, and Renacon AAC."
      >
        <div className="bg-line grid gap-px lg:grid-cols-3">
          {verticals.map((item, index) => (
            <Reveal key={item.title} transition={{ delay: index * 0.06 }}>
              <Link href={item.href} className="group bg-ink block h-full">
                <HoverMedia className="aspect-[4/5]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="from-ink via-ink/30 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">
                      {item.kicker}
                    </p>
                    <h2 className="font-display text-h3 text-cream mt-3">{item.title}</h2>
                    <p className="text-cream/80 mt-3 max-w-sm text-sm leading-6">{item.copy}</p>
                  </div>
                </HoverMedia>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="apply" eyebrow="Open applications" title="Share your profile with the people team.">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <Text>
              We do not publish a live vacancies list on this page. Send a resume and a short note
              about the work you want to do. The people team reviews every application and will be
              in touch when a role matches your experience.
            </Text>
            <p className="text-caption text-cream-muted mt-6">
              Resumes are stored privately. They are not published on the website.
            </p>

            <ul className="mt-10 space-y-6">
              {offices.map((office) => (
                <li key={office.region} className="border-line border-t pt-5">
                  <p className="text-eyebrow text-brass tracking-[0.2em] uppercase">{office.role}</p>
                  <p className="font-display text-h4 text-cream mt-2">{office.region}</p>
                  <p className="text-cream/75 mt-2 text-sm leading-6">{office.address}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3">
              {peopleContacts.map((contact) => (
                <p key={contact.email} className="text-sm">
                  {contact.label}:{" "}
                  <a className="text-brass hover:underline" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </p>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/about">Read the group story</Link>
              </Button>
            </div>
          </div>

          <CareerApplicationForm sourcePath="/careers" />
        </div>
      </Section>
    </>
  );
}
