import { CheckCircle2, Plus } from "lucide-react";

interface HabitTrackerHeaderProps {
  onAddHabit: () => void;
}

export function HabitTrackerHeader({ onAddHabit }: HabitTrackerHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </span>
          Habits Tracker
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your daily routines and build consistency over time.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddHabit}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add Habit
      </button>
    </div>
  );
}
