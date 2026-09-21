import type { ReactNode } from "react";
import { Button } from "@/design-system/components/button";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Rule } from "@/design-system/components/rule";
import { Text } from "@/design-system/components/text";

type ErrorStateProps = {
  eyebrow?: string;
  title: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({
  eyebrow = "Something went wrong",
  title,
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="max-w-lg" role="alert">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading variant="h2" className="mt-4">
        {title}
      </Heading>
      <Rule className="mt-6" />
      <Text variant="muted" className="mt-6">
        {message}
      </Text>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  eyebrow = "Nothing here yet",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="max-w-lg">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading variant="h3" className="mt-4">
        {title}
      </Heading>
      <Text variant="muted" className="mt-4">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button className="mt-8" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
