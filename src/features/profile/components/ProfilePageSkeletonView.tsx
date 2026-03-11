"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeletonView() {
  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-24 pt-6 md:p-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-6 shadow-sm md:p-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <Skeleton className="h-32 w-32 rounded-4xl md:h-40 md:w-40" />
          <div className="w-full flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-9 w-52" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-16 w-full max-w-xl" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-52" />
            </div>
            <div className="flex gap-3 pt-1">
              <Skeleton className="h-11 w-36 rounded-full" />
              <Skeleton className="h-11 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-3xl border border-border bg-card p-6">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-3xl border border-border bg-card p-5">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-36" />
          <div className="space-y-2 rounded-3xl border border-border bg-card p-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-4 rounded-4xl border border-primary/20 bg-card p-8">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
