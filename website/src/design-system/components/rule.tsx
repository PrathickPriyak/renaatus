import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type RuleProps = ComponentProps<"div"> & {
  tone?: "brass" | "line";
};

export function Rule({ className, tone = "brass", ...props }: RuleProps) {
  return (
    <div
      role="presentation"
      className={cn(
        "h-px w-10",
        tone === "brass" ? "bg-brass" : "bg-cream/15",
        className,
      )}
      {...props}
    />
  );
}
