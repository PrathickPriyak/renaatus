import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)} role="status">
      <span
        className="size-5 rounded-full border border-cream/20 border-t-brass motion-safe:animate-[ds-spin_0.8s_linear_infinite]"
        aria-hidden
      />
      <span className="text-caption tracking-[0.16em] text-cream-muted uppercase">
        {label}
      </span>
    </div>
  );
}

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-cream/8 motion-safe:animate-pulse",
        className ?? "h-4 w-full",
      )}
      aria-hidden
    />
  );
}

export function SkeletonBlock({ className }: SkeletonProps) {
  return (
    <div className={cn("grid gap-3", className)} aria-busy="true" aria-live="polite">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
