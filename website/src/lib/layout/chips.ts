import { cn } from "@/lib/utils";

export function filterChipClass(active: boolean): string {
  return cn(
    "inline-flex min-h-11 items-center border px-4 text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-200",
    active
      ? "border-brass text-brass"
      : "border-line text-cream/80 hover:border-cream/40 hover:text-cream",
  );
}
