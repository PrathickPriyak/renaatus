import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-1 text-eyebrow font-medium tracking-[0.18em] uppercase",
  {
    variants: {
      variant: {
        outline: "border border-line text-cream/80",
        brass: "border border-brass/40 text-brass",
        solid: "bg-brand text-white",
        muted: "bg-cream/8 text-cream-muted",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
