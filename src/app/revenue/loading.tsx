import { Skeleton } from "@/components/ui/skeleton";

export default function RevenueLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Tab bar */}
      <Skeleton className="h-10 w-64" />

      {/* Charts: 2 side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-4">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="rounded-xl border p-4">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
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
