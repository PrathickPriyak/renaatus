"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm font-medium tracking-[0.14em] uppercase transition-colors duration-200 outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-bright",
        secondary:
          "border border-cream/20 bg-transparent text-cream hover:border-cream/45 hover:bg-cream/5",
        ghost: "text-cream/80 hover:text-cream",
        brass: "bg-brass text-ink hover:bg-cream",
      },
      size: {
        sm: "min-h-11 h-11 px-4 text-[0.65rem]",
        md: "min-h-11 h-11 px-6 text-[0.7rem]",
        lg: "min-h-12 h-12 px-8 text-[0.72rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, type = "button", ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...(asChild ? {} : { type })}
      {...props}
    />
  );
});

export { buttonVariants };
