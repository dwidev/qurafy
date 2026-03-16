import { Check, Minus, Pencil, Plus, Trash2 } from "lucide-react";
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

const colorClasses: Record<HabitRecord["color"], { badge: string; solid: string; soft: string }> = {
  emerald: {
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    solid: "bg-emerald-500 text-white",
    soft: "bg-emerald-500/12",
  },
  amber: {
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-500/12",
  },
  rose: {
    badge: "border-rose-500/20 bg-rose-500/10 text-rose-600",
    solid: "bg-rose-500 text-white",
    soft: "bg-rose-500/12",
  },
  blue: {
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    solid: "bg-blue-500 text-white",
    soft: "bg-blue-500/12",
  },
  indigo: {
    badge: "border-indigo-500/20 bg-indigo-500/10 text-indigo-600",
    solid: "bg-indigo-500 text-white",
    soft: "bg-indigo-500/12",
  },
};

function formatMetricLabel(habit: HabitRecord) {
  if (habit.type === "boolean") {
    return habit.isCompletedToday ? "Done today" : "Pending today";
  }

  const unit = habit.unit ?? "steps";
  return `${habit.todayValue}/${habit.target} ${unit}`;
}

export function HabitItem({ habit, isSaving = false, isDeleting = false, onSaveProgress, onEdit, onDelete }: HabitItemProps) {
  const palette = colorClasses[habit.color];
  const progressPercent = Math.max(0, Math.min(100, Math.round((habit.todayValue / habit.target) * 100)));

  return (
    <article className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black uppercase", palette.soft)}>
              {habit.title.slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-foreground">{habit.title}</h3>
                <span className={cn("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]", palette.badge)}>
                  {habit.category}
                </span>
                <span className="rounded-full border border-border/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {habit.routine}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {formatMetricLabel(habit)}. {habit.currentStreak} day streak, {habit.completionRate7d}% consistency this week.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {habit.week.map((point) => (
              <div key={point.date} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full border border-transparent transition-colors",
                    point.isCompleted ? palette.solid : "bg-secondary",
                    point.isToday && !point.isCompleted && "border-foreground/30 bg-background",
                  )}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {new Date(`${point.date}T00:00:00.000Z`).toLocaleDateString("en-US", { weekday: "narrow" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:min-w-[280px]">
          {habit.type === "boolean" ? (
            <button
              type="button"
              disabled={isSaving || isDeleting}
              onClick={() => onSaveProgress(habit, habit.isCompletedToday ? 0 : 1)}
              className={cn(
                "flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-black uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                habit.isCompletedToday
                  ? `${palette.solid} border-transparent`
                  : "border-border/60 bg-background text-foreground hover:bg-secondary",
              )}
            >
              <Check className="h-4 w-4" />
              {habit.isCompletedToday ? "Completed" : "Mark Done"}
            </button>
          ) : (
            <div className="space-y-3 rounded-[1.5rem] border border-border/60 bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isSaving || isDeleting}
                  onClick={() => onSaveProgress(habit, Math.max(0, habit.todayValue - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <p className="text-2xl font-black tracking-tight text-foreground">{habit.todayValue}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    target {habit.target} {habit.unit}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSaving || isDeleting}
                  onClick={() => onSaveProgress(habit, habit.todayValue + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="h-2 rounded-full bg-secondary">
                <div
                  className={cn("h-full rounded-full transition-all", palette.solid)}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <button
                type="button"
                disabled={isSaving || isDeleting}
                onClick={() => onSaveProgress(habit, habit.target)}
                className={cn(
                  "flex h-11 items-center justify-center rounded-2xl text-sm font-black uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                  palette.solid,
                )}
              >
                Complete Target
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSaving || isDeleting}
              onClick={() => onEdit(habit)}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background text-sm font-bold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              disabled={isSaving || isDeleting}
              onClick={() => onDelete(habit)}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
