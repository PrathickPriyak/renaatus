import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type EyebrowProps = ComponentProps<"p">;

export function Eyebrow({ className, ...props }: EyebrowProps) {
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
