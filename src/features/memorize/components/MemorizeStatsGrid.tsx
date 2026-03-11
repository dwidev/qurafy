"use client";

import type { MemorizeStatItem } from "@/features/memorize/components/memorizePageShared";

export function MemorizeStatsGrid({ items }: { items: MemorizeStatItem[] }) {
  return (
    <div className="animate-in fade-in grid grid-cols-2 gap-3 duration-500 md:grid-cols-4">
      {items.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs leading-none text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-lg font-bold leading-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
