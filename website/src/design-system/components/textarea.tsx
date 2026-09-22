import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-32 w-full min-w-0 rounded-sm border border-line bg-ink px-4 py-3 text-base text-cream outline-none md:text-sm",
        "placeholder:text-cream-muted/70",
        "transition-colors duration-200",
        "focus-visible:border-brass",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
