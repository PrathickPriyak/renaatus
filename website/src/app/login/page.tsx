import type { Metadata } from "next";
import { Container } from "@/design-system/components/container";
import { Heading } from "@/design-system/components/heading";
import { Text } from "@/design-system/components/text";
import { LoginForm } from "@/components/admin/LoginForm";
import { safeAdminNextPath } from "@/lib/auth/login";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeAdminNextPath(params.next);

  return (
    <section className="py-16 md:py-24">
      <Container width="narrow">
        <p className="text-caption text-brass tracking-[0.18em] uppercase">Staff</p>
        <Heading variant="h1" className="mt-4">
          Sign in
        </Heading>
        <Text variant="muted" className="mt-4">
          Enquiry export is available to authorised administrators only. PostgreSQL
          remains the source of truth; spreadsheets are downloads, not records.
        </Text>
        <div className="border-line bg-panel/80 mt-10 rounded-sm border p-6 md:p-8">
          <LoginForm nextPath={nextPath} />
        </div>
      </Container>
    </section>
  );
}
