import { LoaderCircle, Plus } from "lucide-react";
import type { HabitSuggestion, SaveHabitPayload } from "@/features/habits/types";

interface HabitSuggestionsProps {
  suggestions: HabitSuggestion[];
  isPending: boolean;
  onQuickAdd: (payload: SaveHabitPayload) => void;
}

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
};

const colorTextMap: Record<string, string> = {
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
  blue: "text-blue-600",
  indigo: "text-indigo-600",
};

const colorBgMap: Record<string, string> = {
  emerald: "bg-emerald-500/10",
  amber: "bg-amber-500/10",
  rose: "bg-rose-500/10",
  blue: "bg-blue-500/10",
  indigo: "bg-indigo-500/10",
};

export function HabitSuggestions({ suggestions, isPending, onQuickAdd }: HabitSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Templates
          </p>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Quick start ideas</h2>
        </div>
        {isPending ? <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" /> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {suggestions.slice(0, 4).map((suggestion) => {
          const accentBar = colorMap[suggestion.color] ?? "bg-primary";
          const accentText = colorTextMap[suggestion.color] ?? "text-primary";
          const accentBg = colorBgMap[suggestion.color] ?? "bg-primary/10";

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
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {/* Left accent bar */}
              <span className={`absolute inset-y-0 left-0 w-1 rounded-l-3xl ${accentBar}`} />

              <div className="flex items-start justify-between gap-3 pl-3">
                <div className="flex-1 space-y-2">
                  {/* Icon + meta */}
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${accentBg} ${accentText}`}>
                      <Plus className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${accentText}`}>
                        {suggestion.category}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {suggestion.routine}
                      </p>
                    </div>
                  </div>

                  {/* Habit label */}
                  <p className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                    {suggestion.label}
                  </p>
                </div>

                {/* Quick add badge */}
                <span className="shrink-0 mt-0.5 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
