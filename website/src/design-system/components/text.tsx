import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

const textVariants = cva("max-w-prose", {
  variants: {
    variant: {
      lead: "text-lead text-cream/85",
      body: "text-body text-cream/80",
      muted: "text-body text-cream-muted",
      caption: "text-caption text-cream-muted",
      small: "text-caption text-cream/70",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextProps = ComponentProps<"p"> & VariantProps<typeof textVariants>;

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { variant, className, ...props },
  ref,
) {
  return <p ref={ref} className={cn(textVariants({ variant }), className)} {...props} />;
});
