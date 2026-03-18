import { LoaderCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitSuggestion, SaveHabitPayload } from "@/features/habits/types";

interface HabitSuggestionsProps {
  suggestions: HabitSuggestion[];
  isPending: boolean;
  onQuickAdd: (payload: SaveHabitPayload) => void;
}

const accentMap: Record<string, string> = {
  emerald: "bg-emerald-500/70",
  amber: "bg-amber-500/70",
  rose: "bg-rose-500/70",
  blue: "bg-blue-500/70",
  indigo: "bg-indigo-500/70",
};

export function HabitSuggestions({ suggestions, isPending, onQuickAdd }: HabitSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Templates
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Quick start ideas</h2>
        </div>
        {isPending ? <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" /> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {suggestions.slice(0, 4).map((suggestion) => {
          const accentDot = accentMap[suggestion.color] ?? "bg-primary/70";

          return (
            <button
              key={suggestion.label}
              type="button"
              disabled={isPending}
              onClick={() =>
                onQuickAdd({
                  title: suggestion.label,
                  category: suggestion.category,
                  color: suggestion.color,
                  routine: suggestion.routine,
                  type: suggestion.type,
                  target: suggestion.target,
                  unit: suggestion.unit,
                })
              }
              className="group rounded-[1.75rem] border border-border/70 bg-card/80 p-5 text-left shadow-sm transition-colors hover:border-border hover:bg-card disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-background text-foreground">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", accentDot)} />
                        {suggestion.category}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{suggestion.routine}</p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold leading-6 tracking-tight text-foreground">
                    {suggestion.label}
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-border/70 bg-background px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground">
                  Add
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
