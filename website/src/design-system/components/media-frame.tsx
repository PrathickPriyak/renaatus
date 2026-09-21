import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type MediaFrameProps = ComponentProps<"div">;

export function MediaFrame({ className, ...props }: MediaFrameProps) {
  return (
    <div
      className={cn("relative overflow-hidden bg-[#0c1118]", className)}
      {...props}
    />
  );
}
