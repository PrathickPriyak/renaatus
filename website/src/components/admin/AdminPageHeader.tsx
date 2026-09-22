import type { ReactNode } from "react";
import { Badge } from "@/design-system/components/badge";
import { Heading } from "@/design-system/components/heading";
import { Text } from "@/design-system/components/text";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-caption text-brass tracking-[0.18em] uppercase">{eyebrow}</p>
        ) : null}
        <Heading variant="h1" className={eyebrow ? "mt-3" : undefined}>
          {title}
        </Heading>
        {description ? (
          <Text variant="muted" className="mt-3 max-w-2xl">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "new" | "progress" | "closed" | "draft" | "published";
}) {
  const variant =
    tone === "published" || tone === "new"
      ? "brass"
      : tone === "closed"
        ? "muted"
        : "outline";
  return <Badge variant={variant}>{label}</Badge>;
}
