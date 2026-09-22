import { Spinner } from "@/design-system/components/loading";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner label="Loading admin" />
    </div>
  );
}
