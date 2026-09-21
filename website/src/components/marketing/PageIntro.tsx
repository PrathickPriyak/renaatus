import { Breadcrumb } from "@/design-system/components/breadcrumb";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";
import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, copy, children }: PageIntroProps) {
  return (
    <section className="pt-[calc(var(--header-height)+2.75rem)] pb-4">
      <Container>
        <Breadcrumb className="mb-10" />
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading variant="h1" className="mt-4 max-w-4xl">
          {title}
        </Heading>
        <Rule className="mt-6" />
        <Text variant="lead" className="mt-6 max-w-2xl">
          {copy}
        </Text>
        {children}
      </Container>
    </section>
  );
}
