import { startTransition, useState, useEffect } from "react";
import type { HabitRoutine } from "@/features/habits/types";
import { Search, X } from "lucide-react";

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeFiltersCount = 
    Number(!!searchTerm) + 
    Number(activeCategory !== "All") + 
    Number(activeRoutine !== "all") + 
    Number(statusFilter !== "all");

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex h-14 w-full items-center gap-3 rounded-2xl border border-border bg-card px-5 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-accent/50 hover:text-foreground hover:border-primary/30"
      >
        <div className="flex items-center justify-center text-foreground transition-transform duration-300 group-hover:scale-105">
          <Search className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
          Search & Filter Habits...
        </span>
        
        <div className="ml-auto flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
              {activeFiltersCount}
            </span>
          )}
          <span className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm sm:block">
            /
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 md:p-6 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0 z-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-4xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            
            <div className="flex items-center justify-between border-b border-border bg-muted/20 px-8 py-6">
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Search & Filter
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Find your habits
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2.5 bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-8 p-8">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search Query</span>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    autoFocus
                    value={searchTerm}
                    onChange={(event) => startTransition(() => setSearchTerm(event.target.value))}
                    placeholder="E.g., Read Quran"
                    className="flex h-12 w-full rounded-2xl border border-border bg-transparent pl-12 pr-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
                  />
                </div>
              </label>

              <div className="grid gap-5 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
                  <div className="relative">
                    <select
                      value={activeCategory}
                      onChange={(event) => startTransition(() => setActiveCategory(event.target.value))}
                      className="flex h-12 w-full appearance-none rounded-2xl border border-border bg-transparent px-4 py-3 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none"
                    >
                      <option value="All">All categories</option>
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Routine</span>
                  <div className="relative">
                    <select
                      value={activeRoutine}
                      onChange={(event) => startTransition(() => setActiveRoutine(event.target.value as "all" | HabitRoutine))}
                      className="flex h-12 w-full appearance-none rounded-2xl border border-border bg-transparent px-4 py-3 text-sm capitalize transition-colors focus-visible:border-primary focus-visible:outline-none"
                    >
                      <option value="all">All routines</option>
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(event) => startTransition(() => setStatusFilter(event.target.value as StatusFilter))}
                      className="flex h-12 w-full appearance-none rounded-2xl border border-border bg-transparent px-4 py-3 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none"
                    >
                      <option value="all">All habits</option>
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

              <div className="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:justify-end">
                {activeFiltersCount > 0 && (
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
                    className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
