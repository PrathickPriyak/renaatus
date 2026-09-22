import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SelectProps = ComponentProps<"select">;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-12 w-full min-w-0 appearance-none rounded-sm border border-line bg-ink bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat px-4 pr-10 text-base text-cream outline-none md:text-sm",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path fill=%22%23F3EEE4%22 d=%22M1 1.2 6 6.2 11 1.2%22 stroke=%22%23F3EEE4%22 stroke-width=%221.2%22 fill=%22none%22/></svg>')]",
        "transition-colors duration-200",
        "focus-visible:border-brass",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
