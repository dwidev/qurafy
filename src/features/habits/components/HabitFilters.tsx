import { startTransition, useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitRoutine } from "@/features/habits/types";

type StatusFilter = "all" | "pending" | "completed";

interface HabitFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  activeRoutine: "all" | HabitRoutine;
  setActiveRoutine: (value: "all" | HabitRoutine) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  categories: string[];
}

export function HabitFilters({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeRoutine,
  setActiveRoutine,
  statusFilter,
  setStatusFilter,
  categories,
}: HabitFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) {
        event.preventDefault();
        setIsOpen(true);
      }
    }

    function handlePointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const activeFiltersCount =
    Number(!!searchTerm) +
    Number(activeCategory !== "All") +
    Number(activeRoutine !== "all") +
    Number(statusFilter !== "all");

  return (
    <div ref={panelRef} className={cn("relative", isOpen && "z-[60]")}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={cn(
          "relative inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
          isOpen || activeFiltersCount > 0
            ? "border-foreground bg-foreground text-background"
            : "border-border/70 bg-background text-muted-foreground hover:text-foreground",
        )}
        title="Search & filter (press /)"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Filters</span>
        {activeFiltersCount > 0 ? (
          <span
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium",
              isOpen || activeFiltersCount > 0 ? "bg-background text-foreground" : "bg-foreground text-background",
            )}
          >
            {activeFiltersCount}
          </span>
        ) : null}
        <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 opacity-70" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[70] w-[min(30rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-border/70 bg-background/60 px-5 py-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Search & Filter
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Narrow the habit list
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-border/70 bg-background p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 p-5">
            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Search
              </span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={(event) => startTransition(() => setSearchTerm(event.target.value))}
                  placeholder="Search habits..."
                  className="flex h-11 w-full rounded-2xl border border-border/70 bg-background pl-11 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none"
                />
              </div>
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Category
                </span>
                <div className="relative">
                  <select
                    value={activeCategory}
                    onChange={(event) => startTransition(() => setActiveCategory(event.target.value))}
                    className="flex h-11 w-full appearance-none rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm transition-colors focus-visible:border-foreground focus-visible:outline-none"
                  >
                    <option value="All">All</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Routine
                </span>
                <div className="relative">
                  <select
                    value={activeRoutine}
                    onChange={(event) => startTransition(() => setActiveRoutine(event.target.value as "all" | HabitRoutine))}
                    className="flex h-11 w-full appearance-none rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm capitalize transition-colors focus-visible:border-foreground focus-visible:outline-none"
                  >
                    <option value="all">All</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Status
                </span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => startTransition(() => setStatusFilter(event.target.value as StatusFilter))}
                    className="flex h-11 w-full appearance-none rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm transition-colors focus-visible:border-foreground focus-visible:outline-none"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-4 sm:flex-row sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {activeFiltersCount > 0 ? `${activeFiltersCount} active filter${activeFiltersCount > 1 ? "s" : ""}` : "No active filters"}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {activeFiltersCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        setSearchTerm("");
                        setActiveCategory("All");
                        setActiveRoutine("all");
                        setStatusFilter("all");
                      });
                    }}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-border/70 bg-background px-5 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
