"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitRecord } from "@/features/habits/types";

interface HabitItemProps {
  habit: HabitRecord;
  isSaving?: boolean;
  isDeleting?: boolean;
  onSaveProgress: (habit: HabitRecord, value: number) => Promise<void> | void;
  onEdit: (habit: HabitRecord) => void;
  onDelete: (habit: HabitRecord) => Promise<void> | void;
}

const colorClasses: Record<HabitRecord["color"], { dot: string; bar: string }> = {
  emerald: {
    dot: "bg-emerald-500/70",
    bar: "bg-emerald-500/70",
  },
  amber: {
    dot: "bg-amber-500/70",
    bar: "bg-amber-500/70",
  },
  rose: {
    dot: "bg-rose-500/70",
    bar: "bg-rose-500/70",
  },
  blue: {
    dot: "bg-blue-500/70",
    bar: "bg-blue-500/70",
  },
  indigo: {
    dot: "bg-indigo-500/70",
    bar: "bg-indigo-500/70",
  },
};

export function HabitItem({ habit, isSaving = false, isDeleting = false, onSaveProgress, onEdit, onDelete }: HabitItemProps) {
  const palette = colorClasses[habit.color];
  const progressPercent = Math.max(0, Math.min(100, Math.round((habit.todayValue / habit.target) * 100)));
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/80 shadow-sm transition-colors",
        habit.isCompletedToday && "border-primary/15 bg-primary/[0.03]",
      )}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-3 md:px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background text-[11px] font-semibold uppercase text-foreground">
          {habit.title.slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className={cn("truncate text-[13px] font-semibold tracking-tight", habit.isCompletedToday ? "text-muted-foreground line-through" : "text-foreground")}>
              {habit.title}
            </h3>
            <span className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-background px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex">
              <span className={cn("h-1.5 w-1.5 rounded-full", palette.dot)} />
              {habit.category}
            </span>
            {habit.isCompletedToday ? (
              <span className="hidden rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-primary sm:inline-flex">
                Done today
              </span>
            ) : null}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="font-medium uppercase tracking-[0.2em]">{habit.routine}</span>
            <span>•</span>
            <span>{habit.currentStreak}d streak</span>
            <span>•</span>
            <span>{habit.completionRate7d}% week</span>
          </div>

          {habit.type === "quantitative" ? (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-all duration-500", palette.bar)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          ) : null}
        </div>

        <div className="hidden shrink-0 items-center gap-1 md:flex">
          {habit.week.map((point) => (
            <div
              key={point.date}
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                point.isCompleted ? palette.dot : "bg-secondary",
                point.isToday && !point.isCompleted && "ring-2 ring-border ring-offset-2 ring-offset-card",
              )}
            />
          ))}
        </div>

        {habit.type === "boolean" ? (
          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={() => void onSaveProgress(habit, habit.isCompletedToday ? 0 : 1)}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              habit.isCompletedToday
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/70 bg-background text-foreground hover:bg-secondary",
            )}
            title={habit.isCompletedToday ? "Mark undone" : "Mark done"}
          >
            <Check className="h-4 w-4" />
          </button>
        ) : progressPercent >= 100 ? (
          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={() => void onSaveProgress(habit, 0)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary bg-primary text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            title="Target reached! Tap to reset"
          >
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              disabled={isSaving || isDeleting}
              onClick={() => void onSaveProgress(habit, Math.max(0, habit.todayValue - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-7 text-center text-[13px] font-semibold text-foreground">
              {habit.todayValue}
            </span>
            <button
              type="button"
              disabled={isSaving || isDeleting}
              onClick={() => void onSaveProgress(habit, habit.todayValue + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground transition-colors hover:text-foreground"
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {expanded ? (
        <div className="border-t border-border/70 bg-background/70 px-5 py-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-wrap items-center gap-3">
            {habit.type === "quantitative" ? (
              <>
                <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background px-3 py-2">
                  <button
                    type="button"
                    disabled={isSaving || isDeleting}
                    onClick={() => void onSaveProgress(habit, Math.max(0, habit.todayValue - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <div className="text-center">
                    <p className="text-lg font-semibold leading-none text-foreground">{habit.todayValue}</p>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      / {habit.target} {habit.unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving || isDeleting}
                    onClick={() => void onSaveProgress(habit, habit.todayValue + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  type="button"
                  disabled={isSaving || isDeleting}
                  onClick={() => void onSaveProgress(habit, habit.target)}
                  className="h-10 rounded-full bg-foreground px-4 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
                >
                  Complete Target
                </button>
              </>
            ) : null}

            <div className="flex items-center gap-1.5 md:hidden">
              {habit.week.map((point) => (
                <div key={point.date} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      point.isCompleted ? palette.dot : "bg-secondary",
                      point.isToday && !point.isCompleted && "ring-2 ring-border ring-offset-2 ring-offset-background",
                    )}
                  />
                  <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {new Date(`${point.date}T00:00:00.000Z`).toLocaleDateString("en-US", { weekday: "narrow" })}
                  </span>
                </div>
              ))}
            </div>

            <div className="ml-auto flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isSaving || isDeleting}
                onClick={() => onEdit(habit)}
                className="flex h-10 items-center gap-1.5 rounded-full border border-border/70 bg-background px-4 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                type="button"
                disabled={isSaving || isDeleting}
                onClick={() => void onDelete(habit)}
                className="flex h-10 items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/5 px-4 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
              >
                <Trash2 className="h-3 w-3" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
