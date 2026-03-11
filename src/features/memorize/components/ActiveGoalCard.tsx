"use client";

import type { ActiveGoalCardProps } from "@/features/memorize/components/memorizePageShared";

function CircleProgress({ pct }: { pct: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (pct / 100);

  return (
    <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        className="text-primary transition-all duration-700"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
      />
      <text x="50" y="57" textAnchor="middle" className="origin-center rotate-90 fill-foreground text-[20px] font-bold">
        {pct}%
      </text>
    </svg>
  );
}

export function ActiveGoalCard({ goal, selectedSurahName, pct, remainingDays }: ActiveGoalCardProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-border bg-linear-to-br from-card to-primary/5 p-6 shadow-sm duration-500 delay-100 md:p-8">
      <div className="flex items-center gap-8">
        <div className="hidden shrink-0 sm:block">
          <CircleProgress pct={pct} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Active Goal
            </div>
            <span className="text-xs text-muted-foreground">
              Day {goal.passedDays} of {goal.totalDays} · {remainingDays} days left
            </span>
          </div>
          <div>
            <h2 className="truncate text-2xl font-bold">{goal.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{selectedSurahName || goal.surah}</p>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-2.5 rounded-full bg-linear-to-r from-primary to-primary/70 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {goal.doneVerses} / {goal.totalVerses} verses
              </span>
              <span className="font-medium text-primary">{pct}% done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
