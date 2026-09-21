import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/marketing";
import { Card, CardDescription, CardHeader, CardMeta, CardTitle, Container } from "@/design-system";
import { verticals } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "EPC, luxury realty, and AAC materials from Renaatus.",
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Manufacturer and builder in one group."
        copy="Three lines of work — infrastructure as EPC, residences, and Renacon AAC — drawn from what the company already delivers."
      />
      <Container className="grid gap-6 pb-[var(--section-y)] lg:grid-cols-3">
        {verticals.map((item) => (
          <Link key={item.title} href={item.href} className="block">
            <Card className="h-full">
              <CardHeader>
                <CardMeta>{item.kicker}</CardMeta>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.copy}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </Container>
    </>
  );
}
