import { cva, type VariantProps } from "class-variance-authority";
import { createElement, forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

const headingVariants = cva("text-balance text-cream", {
  variants: {
    variant: {
      display: "font-display text-display tracking-[-0.02em]",
      h1: "font-display text-h1 tracking-[-0.015em]",
      h2: "font-display text-h2 tracking-[-0.01em]",
      h3: "font-sans text-h3 font-medium tracking-tight",
      h4: "font-sans text-h4 font-medium tracking-tight",
    },
  },
  defaultVariants: {
    variant: "h2",
  },
});

type Level = "h1" | "h2" | "h3" | "h4" | "h5" | "p";

type HeadingProps = ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & {
    as?: Level;
  };

const defaultElement: Record<NonNullable<HeadingProps["variant"]>, Level> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
};

export const Heading = forwardRef<HTMLElement, HeadingProps>(function Heading(
  { as, variant = "h2", className, ...props },
  ref,
) {
  const tag = variant ?? "h2";
  const Comp = as ?? defaultElement[tag];
  return createElement(Comp, {
    ref,
    className: cn(headingVariants({ variant: tag }), className),
    ...props,
  });
});
