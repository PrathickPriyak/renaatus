import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("border border-line bg-stone text-cream", {
  variants: {
    variant: {
      surface: "p-6 md:p-8",
      media: "overflow-hidden p-0",
      quiet: "border-transparent bg-ink-soft p-6 md:p-8",
    },
  },
  defaultVariants: {
    variant: "surface",
  },
});

type CardProps = ComponentProps<"article"> & VariantProps<typeof cardVariants>;

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <article
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid gap-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("font-display text-h3 tracking-tight", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-body text-cream-muted", className)} {...props} />;
}

export function CardMeta({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-eyebrow font-medium tracking-[0.24em] text-brass uppercase",
        className,
      )}
      {...props}
    />
  );
}
