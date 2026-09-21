import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/design-system/components/container";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";

type SectionProps = ComponentProps<"section"> & {
  tone?: "ink" | "soft";
  eyebrow?: string;
  title?: string;
  intro?: string;
  width?: "default" | "narrow" | "wide";
  header?: ReactNode;
};

export function Section({
  className,
  tone = "ink",
  eyebrow,
  title,
  intro,
  width = "default",
  header,
  children,
  ...props
}: SectionProps) {
  const hasHeader = Boolean(header || eyebrow || title || intro);

  return (
    <section
      className={cn(
        "py-[var(--section-y)]",
        tone === "soft" ? "bg-ink-soft" : "bg-ink",
        className,
      )}
      {...props}
    >
      <Container width={width}>
        {hasHeader ? (
          <header className="mb-12 max-w-3xl md:mb-16">
            {header ?? (
              <>
                {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
                {title ? (
                  <Heading variant="h2" className={eyebrow ? "mt-4" : undefined}>
                    {title}
                  </Heading>
                ) : null}
                {title || eyebrow ? <Rule className="mt-6" /> : null}
                {intro ? (
                  <Text variant="lead" className="mt-6">
                    {intro}
                  </Text>
                ) : null}
              </>
            )}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
