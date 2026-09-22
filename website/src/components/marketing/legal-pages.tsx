import type { Metadata } from "next";
import { PageIntro } from "@/components/marketing";
import { Container, Text } from "@/design-system";
import { brand, offices } from "@/lib/content";
import { pageMetadataFromSeo } from "@/lib/seo/metadata";
import { publicSeo } from "@/lib/seo/pages";

type LegalPageProps = {
  title: string;
  description: string;
  path: string;
};

function LegalPage({ title, description, path }: LegalPageProps) {
  const headquarters = offices[0];

  return (
    <>
      <PageIntro
        path={path}
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

export const privacyMetadata: Metadata = pageMetadataFromSeo(publicSeo.privacy);

export function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      title="Privacy"
      description="A full privacy notice will be published here after legal review."
    />
  );
}

export const termsMetadata: Metadata = pageMetadataFromSeo(publicSeo.terms);

export function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      title="Terms of use"
      description="Site terms of use will be published here after legal review."
    />
  );
}

export const cookiesMetadata: Metadata = pageMetadataFromSeo(publicSeo.cookies);

export function CookiesPage() {
  return (
    <LegalPage
      path="/cookies"
      title="Cookies"
      description="A cookie notice will be published here after legal review."
    />
  );
}
