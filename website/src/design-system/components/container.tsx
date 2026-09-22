import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    width: {
      default: "max-w-[80rem]",
      narrow: "max-w-[42rem]",
      wide: "max-w-[90rem]",
    },
    padded: {
      true: "px-[var(--gutter)]",
      false: "",
    },
  },
  defaultVariants: {
    width: "default",
    padded: true,
  },
});

type ContainerProps = ComponentProps<"div"> & VariantProps<typeof containerVariants>;

export function Container({ className, width, padded, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ width, padded }), className)} {...props} />
  );
}
