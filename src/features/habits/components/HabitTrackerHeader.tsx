import { CheckCircle2, Plus } from "lucide-react";
import type { ReactNode } from "react";

interface HabitTrackerHeaderProps {
  onAddHabit: () => void;
  filterSlot?: ReactNode;
}

export function HabitTrackerHeader({ onAddHabit, filterSlot }: HabitTrackerHeaderProps) {
  return (
    <section className="relative z-[60] rounded-[2rem] border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm md:p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Daily habits
          </p>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Habit tracker
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                A cleaner place to manage your routine. Review what matters today, keep the page calm, and add habits without the interface fighting for attention.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {filterSlot}
          <button
            type="button"
            onClick={onAddHabit}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </button>
        </div>
      </div>
    </section>
  );
}
