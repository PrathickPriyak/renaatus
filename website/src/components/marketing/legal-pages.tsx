import type { Metadata } from "next";
import { PageIntro } from "@/components/marketing";
import { Container, Text } from "@/design-system";
import { brand, offices } from "@/lib/content";

type LegalPageProps = {
  title: string;
  description: string;
};

function LegalPage({ title, description }: LegalPageProps) {
  const headquarters = offices[0];

  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title={title}
        copy="This policy is being prepared for legal review and is not yet published. The company details below are current."
      />
      <Container className="pb-[var(--section-y)]">
        <div className="max-w-2xl">
          <Text>
            {brand.legal}. {description}
          </Text>
          {headquarters ? (
            <Text className="mt-6">
              Headquarters: {headquarters.address} {headquarters.email}
              {headquarters.phone ? ` · ${headquarters.phone}` : ""}.
            </Text>
          ) : null}
        </div>
      </Container>
    </>
  );
}

export const privacyMetadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Renaatus Projects Pvt Ltd — pending legal review.",
};

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      description="A full privacy notice will be published here after legal review."
    />
  );
}

export const termsMetadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Renaatus Projects Pvt Ltd — pending legal review.",
};

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      description="Site terms of use will be published here after legal review."
    />
  );
}

export const cookiesMetadata: Metadata = {
  title: "Cookies",
  description: "Cookie notice for Renaatus Projects Pvt Ltd — pending legal review.",
};

export function CookiesPage() {
  return (
    <LegalPage
      title="Cookies"
      description="A cookie notice will be published here after legal review."
    />
  );
}
