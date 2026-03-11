"use client";

import type { ProfileStat } from "@/features/profile/components/profile-page-types";

export function ProfileStatsGrid({ stats }: { stats: ProfileStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="absolute -bottom-4 -right-4 text-foreground opacity-5 transition-transform group-hover:scale-110 group-hover:-rotate-12">
            <stat.icon className="h-24 w-24" />
          </div>
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <p className="text-3xl font-black leading-none">{stat.value}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
