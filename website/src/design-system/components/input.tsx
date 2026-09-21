import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input">;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-sm border border-line bg-ink px-4 text-base text-cream outline-none md:text-sm",
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
