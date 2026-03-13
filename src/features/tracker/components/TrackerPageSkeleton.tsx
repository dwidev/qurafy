import { Skeleton } from "@/components/ui/skeleton";

export function TrackerPageSkeleton() {
  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-24 pt-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <Skeleton className="h-11 w-11 rounded-2xl" />
            <Skeleton className="mt-4 h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="mt-6 h-36 w-full rounded-3xl" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-44" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
