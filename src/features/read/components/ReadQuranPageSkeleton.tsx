import { Skeleton } from "@/components/ui/skeleton";

export function ReadQuranPageSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">
      <div className="space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="sticky top-0 z-10 flex flex-col md:flex-row items-center gap-4 py-4 bg-background/95 backdrop-blur-md rounded-2xl mx-1 pt-4 pb-2">
        <Skeleton className="h-11 w-full md:w-56 rounded-full" />
        <Skeleton className="h-11 flex-1 w-full rounded-full" />
        <Skeleton className="h-11 w-11 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
