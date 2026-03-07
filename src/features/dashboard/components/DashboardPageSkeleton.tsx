import { Skeleton } from "@/components/ui/skeleton";

export function DashboardPageSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-32">
      <div className="rounded-4xl border border-border bg-card p-4 md:p-1 md:pr-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Skeleton className="h-10 w-full md:w-64 rounded-full" />
          <div className="flex items-center gap-6 w-full md:w-auto">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border bg-card p-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 mt-2" />
          </div>
        ))}
      </div>

      <Skeleton className="h-48 w-full rounded-3xl" />
      <Skeleton className="h-64 w-full rounded-3xl" />

      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-56 w-full rounded-3xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
