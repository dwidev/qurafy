import { Skeleton } from "@/components/ui/skeleton";

export function HabitTrackerPageSkeleton() {
  return (
    <div className="space-y-6 pb-28">
      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <div className="flex items-start gap-3">
              <Skeleton className="h-11 w-11 rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-44 rounded-xl" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Skeleton className="h-11 w-full rounded-full sm:w-32" />
            <Skeleton className="h-11 w-full rounded-full sm:w-32" />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm md:p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-7 w-24 rounded-xl" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[280px]">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="mt-2 h-7 w-14" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <Skeleton className="h-8 w-10 rounded-full" />
                <Skeleton className="h-3 w-4" />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border/70 bg-background/70 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>
                <Skeleton className="mt-6 h-3 w-28" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-11 w-11 rounded-2xl" />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[1.75rem] border border-border/70 bg-card/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-48 max-w-full" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
