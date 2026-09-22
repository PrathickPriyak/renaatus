import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function BrandMark({ className, size = 36, priority }: BrandMarkProps) {
  return (
    <Image
      src="/assets/logos/renaatus-mark.png"
      alt="Renaatus"
      width={size}
      height={size}
      priority={priority}
      className={cn("h-9 w-9", className)}
    />
  );
}

type BrandWordmarkProps = {
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function BrandWordmark({ className, priority, decorative }: BrandWordmarkProps) {
  return (
    <Image
      src="/assets/logos/renaatus-logo-light.png"
      alt={decorative ? "" : "Renaatus"}
      width={140}
      height={36}
      priority={priority}
      className={cn("h-7 w-auto", className)}
    />
  );
}

export function BrandLockup({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex min-h-11 items-center gap-3", className)}>
      <BrandMark priority={priority} />
      <BrandWordmark priority={priority} decorative />
    </span>
  );
}
