import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* 3 Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>

      {/* 2 charts side by side */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-4">
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-40 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="rounded-xl border p-4">
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-3 w-40 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>

      {/* Full-width chart */}
      <div className="rounded-xl border p-4">
        <Skeleton className="h-4 w-36 mb-2" />
        <Skeleton className="h-3 w-32 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>

      {/* Table */}
      <div className="rounded-xl border p-4 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}
