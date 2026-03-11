"use client";

import { Calendar } from "lucide-react";

export function UpcomingTargetsSection({ items }: { items: { day: string; range: string; count: number }[] }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 pt-4 duration-500 delay-300">
      <h2 className="text-xl font-bold">Upcoming Targets</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.day}-${index}`}
            className="flex cursor-default items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-sm transition-all hover:border-primary/30 hover:shadow-sm md:text-base"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.day}</p>
                <p className="mt-0.5 font-semibold">{item.range}</p>
              </div>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {item.count} verses
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
