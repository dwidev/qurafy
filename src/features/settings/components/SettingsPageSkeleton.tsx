import { Skeleton } from "@/components/ui/skeleton";

export function SettingsPageSkeleton() {
  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-32 pt-6 md:p-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2 rounded-[2rem] border border-border bg-card p-3 shadow-sm">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-2xl" />
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="space-y-2">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>

            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-6.5 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
