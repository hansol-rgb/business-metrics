import { Skeleton } from "@/components/ui/skeleton";

export default function ClientLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-4">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-[350px] w-full" />
      </div>
      <div className="rounded-xl border p-4">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
}
