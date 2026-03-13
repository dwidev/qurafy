import { Skeleton } from "@/components/ui/skeleton";

export function MemorizeSessionPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8 p-6 md:p-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          <div className="space-y-3 text-center">
            <Skeleton className="mx-auto h-4 w-24 rounded-full" />
            <Skeleton className="mx-auto h-10 w-56" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2 rounded-2xl border border-border/70 bg-background/70 p-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Skeleton className="h-12 w-44 rounded-full" />
          </div>
        </div>

        <div className="w-full max-w-3xl rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <Skeleton className="mx-auto h-16 w-full max-w-2xl" />
            <Skeleton className="mx-auto h-4 w-3/4" />
            <div className="flex justify-center gap-3">
              <Skeleton className="h-11 w-32 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
