import { SkeletonBlock } from "@/design-system/components/loading";

export default function SiteLoading() {
  return (
    <div className="flex min-h-[min(36rem,70dvh)] flex-col justify-end px-6 pt-[calc(var(--header-height)+2rem)] pb-16">
      <SkeletonBlock className="max-w-xl" />
    </div>
  );
}
