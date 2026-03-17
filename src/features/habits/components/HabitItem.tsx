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

const colorClasses: Record<HabitRecord["color"], { badge: string; solid: string; soft: string; bar: string }> = {
  emerald: {
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    solid: "bg-emerald-500 text-white",
    soft: "bg-emerald-500/12 text-emerald-600",
    bar: "bg-emerald-500",
  },
  amber: {
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-500/12 text-amber-600",
    bar: "bg-amber-500",
  },
  rose: {
    badge: "border-rose-500/20 bg-rose-500/10 text-rose-600",
    solid: "bg-rose-500 text-white",
    soft: "bg-rose-500/12 text-rose-600",
    bar: "bg-rose-500",
  },
  blue: {
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    solid: "bg-blue-500 text-white",
    soft: "bg-blue-500/12 text-blue-600",
    bar: "bg-blue-500",
  },
  indigo: {
    badge: "border-indigo-500/20 bg-indigo-500/10 text-indigo-600",
    solid: "bg-indigo-500 text-white",
    soft: "bg-indigo-500/12 text-indigo-600",
    bar: "bg-indigo-500",
  },
};

export function HabitItem({ habit, isSaving = false, isDeleting = false, onSaveProgress, onEdit, onDelete }: HabitItemProps) {
  const palette = colorClasses[habit.color];
  const progressPercent = Math.max(0, Math.min(100, Math.round((habit.todayValue / habit.target) * 100)));
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/20 hover:shadow-sm",
        habit.isCompletedToday && "opacity-80",
      )}
    >
      {/* Color accent bar */}
      <span className={cn("absolute inset-y-0 left-0 w-1", palette.bar)} />

      {/* Main row */}
      <div className="flex items-center gap-3 pl-4 pr-3 py-3">
        {/* Avatar */}
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold uppercase", palette.soft)}>
          {habit.title.slice(0, 2)}
        </div>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn("truncate text-sm font-bold tracking-tight", habit.isCompletedToday ? "text-muted-foreground line-through" : "text-foreground")}>
              {habit.title}
            </h3>
            <span className={cn("hidden shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest sm:inline-block", palette.badge)}>
              {habit.category}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {habit.routine}
            </span>
            <span className="text-[10px] text-muted-foreground/60">·</span>
            <span className="text-[10px] text-muted-foreground/80">
              {habit.currentStreak}d streak · {habit.completionRate7d}% / week
            </span>
          </div>
          {/* Progress bar for quantitative */}
          {habit.type === "quantitative" && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-all duration-500", palette.bar)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Week dots */}
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          {habit.week.map((point) => (
            <div key={point.date} className="flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full border border-transparent transition-colors",
                  point.isCompleted ? palette.solid : "bg-secondary",
                  point.isToday && !point.isCompleted && "border-foreground/30 bg-background",
                )}
              />
            </div>
          ))}
        </div>

        {/* Quick action */}
        {habit.type === "boolean" ? (
          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={() => void onSaveProgress(habit, habit.isCompletedToday ? 0 : 1)}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60",
              habit.isCompletedToday
                ? `${palette.solid} border-transparent shadow-sm`
                : "border-border bg-background text-foreground hover:bg-secondary",
            )}
            title={habit.isCompletedToday ? "Mark undone" : "Mark done"}
          >
            <Check className="h-4 w-4" />
          </button>
        ) : progressPercent >= 100 ? (
          /* Target reached — show checkmark, tap to reset */
          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={() => void onSaveProgress(habit, 0)}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-transparent shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60",
              palette.solid,
            )}
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-8 text-center text-sm font-bold text-foreground">
              {habit.todayValue}
            </span>
            <button
              type="button"
              disabled={isSaving || isDeleting}
              onClick={() => void onSaveProgress(habit, habit.todayValue + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Edit / delete icon buttons */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={() => onEdit(habit)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-60"
            title="Edit habit"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={() => void onDelete(habit)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-60"
            title="Delete habit"
          >
            <Trash2 className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Expanded panel — extra controls */}
      {expanded && (
        <div className="border-t border-border bg-secondary/5 px-5 py-4 pl-5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-wrap items-center gap-3">
            {habit.type === "quantitative" && (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                  <button
                    type="button"
                    disabled={isSaving || isDeleting}
                    onClick={() => void onSaveProgress(habit, Math.max(0, habit.todayValue - 1))}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <div className="text-center">
                    <p className="text-lg font-bold leading-none text-foreground">{habit.todayValue}</p>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">/ {habit.target} {habit.unit}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving || isDeleting}
                    onClick={() => void onSaveProgress(habit, habit.todayValue + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  type="button"
                  disabled={isSaving || isDeleting}
                  onClick={() => void onSaveProgress(habit, habit.target)}
                  className={cn("h-9 rounded-xl px-4 text-xs font-semibold shadow-sm transition-colors disabled:opacity-60", palette.solid)}
                >
                  Complete Target
                </button>
              </>
            )}

            {/* 7-day week row in expand */}
            <div className="flex items-center gap-1.5 md:hidden">
              {habit.week.map((point) => (
                <div key={point.date} className="flex flex-col items-center gap-0.5">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full border border-transparent",
                      point.isCompleted ? palette.solid : "bg-secondary",
                      point.isToday && !point.isCompleted && "border-foreground/30 bg-background",
                    )}
                  />
                  <span className="text-[8px] font-bold uppercase text-muted-foreground">
                    {new Date(`${point.date}T00:00:00.000Z`).toLocaleDateString("en-US", { weekday: "narrow" })}
                  </span>
                </div>
              ))}
            </div>

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                disabled={isSaving || isDeleting}
                onClick={() => onEdit(habit)}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                type="button"
                disabled={isSaving || isDeleting}
                onClick={() => void onDelete(habit)}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-60"
              >
                <Trash2 className="h-3 w-3" />
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
