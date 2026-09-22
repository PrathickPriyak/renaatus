import type { ReactNode } from "react";
import { MediaFrame } from "@/design-system/components/media-frame";
import { cn } from "@/lib/utils";

type HoverMediaProps = {
  children: ReactNode;
  className?: string;
};

/** CSS-only zoom for stills. Disabled by prefers-reduced-motion in globals.css. */
export function HoverMedia({ children, className }: HoverMediaProps) {
  return <MediaFrame className={cn("media-zoom", className)}>{children}</MediaFrame>;
}
