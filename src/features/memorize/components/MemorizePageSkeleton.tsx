import { Skeleton } from "@/components/ui/skeleton";

export function MemorizePageSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <Skeleton className="h-48 w-full rounded-3xl" />
      <Skeleton className="h-44 w-full rounded-3xl" />

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
