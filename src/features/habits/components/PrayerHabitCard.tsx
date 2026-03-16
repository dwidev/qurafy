"use client";

import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitRecord } from "@/features/habits/types";

interface PrayerHabitCardProps {
  habits: HabitRecord[];
  pendingHabitId: string | null;
  onSaveProgress: (habit: HabitRecord, value: number) => Promise<void> | void;
}

const PRAYER_ORDER = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as const;

function getPrayerSortValue(title: string) {
  const index = PRAYER_ORDER.indexOf(title as (typeof PRAYER_ORDER)[number]);
  return index === -1 ? PRAYER_ORDER.length : index;
}

export function PrayerHabitCard({ habits, pendingHabitId, onSaveProgress }: PrayerHabitCardProps) {
  const orderedHabits = habits.toSorted((left, right) => {
    const orderDifference = getPrayerSortValue(left.title) - getPrayerSortValue(right.title);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return left.title.localeCompare(right.title);
  });

  const completedCount = orderedHabits.filter((habit) => habit.isCompletedToday).length;
  const consistencyScore =
    orderedHabits.length === 0
      ? 0
      : Math.round(
          orderedHabits.reduce((total, habit) => total + habit.completionRate7d, 0) / orderedHabits.length,
        );
  const week = Array.from({ length: 7 }, (_, index) => {
    const completed = orderedHabits.filter((habit) => habit.week[index]?.isCompleted).length;
    const label = orderedHabits[0]?.week[index]?.date
      ? new Date(`${orderedHabits[0].week[index].date}T00:00:00.000Z`).toLocaleDateString("en-US", {
          weekday: "narrow",
        })
      : "";

    return {
      completed,
      total: orderedHabits.length,
      label,
    };
  });

  return (
    <article className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-foreground">Prayer</h3>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                {completedCount}/{orderedHabits.length} today
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Keep all five daily prayers visible in one place and check them off one by one.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[260px]">
            <div className="rounded-[1.5rem] border border-border/60 bg-background px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Today</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{completedCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-background px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{orderedHabits.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-background px-4 py-3 sm:col-span-1 col-span-2">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">7d score</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{consistencyScore}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {week.map((point) => (
            <div key={point.label} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[10px] font-black",
                  point.completed === point.total && point.total > 0
                    ? "border-emerald-500/20 bg-emerald-500 text-white"
                    : point.completed > 0
                      ? "border-emerald-500/20 bg-emerald-500/12 text-emerald-600"
                      : "border-border/60 bg-background text-muted-foreground",
                )}
              >
                {point.completed}/{point.total}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{point.label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {orderedHabits.map((habit) => {
            const isSaving = pendingHabitId === habit.id;

            return (
              <button
                key={habit.id}
                type="button"
                disabled={isSaving}
                onClick={() => onSaveProgress(habit, habit.isCompletedToday ? 0 : 1)}
                className={cn(
                  "flex min-h-24 flex-col items-start justify-between rounded-[1.75rem] border px-4 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                  habit.isCompletedToday
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-border/60 bg-background hover:bg-secondary",
                )}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-black tracking-tight text-foreground">{habit.title}</p>
                    <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                      {habit.routine}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      habit.isCompletedToday
                        ? "border-transparent bg-emerald-500 text-white"
                        : "border-border/60 bg-card text-muted-foreground",
                    )}
                  >
                    {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : habit.isCompletedToday ? <Check className="h-4 w-4" /> : null}
                  </div>
                </div>

                <p className="text-xs font-medium text-muted-foreground">
                  {habit.isCompletedToday ? "Checked for today" : "Tap to mark this prayer done"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
