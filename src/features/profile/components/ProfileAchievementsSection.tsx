"use client";

import Link from "next/link";
import { Medal } from "lucide-react";
import type { ProfileAchievement } from "@/features/profile/components/profile-page-types";

export function ProfileAchievementsSection({ achievements }: { achievements: ProfileAchievement[] }) {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-3 px-1 text-2xl font-black">
        Achievements
        <span className="flex h-6 w-9 items-center justify-center rounded-lg bg-secondary text-[10px] font-black text-muted-foreground">
          {achievements.length}
        </span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="group flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/20"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color} shadow-sm transition-transform group-hover:scale-110`}
            >
              <item.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold leading-tight">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}

        <Link
          href="/app/memorize"
          className="group flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-secondary/5 p-5 text-center transition-all hover:bg-secondary/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:text-primary">
            <Medal className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Keep Progressing</p>
        </Link>
      </div>
    </div>
  );
}
