import { Skeleton } from "@/components/ui/skeleton";

export function ReaderPageSkeleton() {
  return (
    <div className="flex h-full flex-col relative pb-24 md:pb-6">
      <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>

      <div className="py-8 pt-10 text-center border-b border-border/40 mb-2">
        <Skeleton className="h-9 w-64 mx-auto" />
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
