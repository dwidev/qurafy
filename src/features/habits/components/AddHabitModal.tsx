"use client";

import { useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import type { HabitColor, HabitRecord, HabitRoutine, HabitType, SaveHabitPayload } from "@/features/habits/types";
import { HABIT_CATEGORIES, HABIT_COLORS, HABIT_ROUTINES } from "@/features/habits/types";
import { cn } from "@/lib/utils";

interface AddHabitModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialHabit?: HabitRecord | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: SaveHabitPayload) => Promise<void> | void;
}

type FormState = {
  title: string;
  category: string;
  color: HabitColor;
  type: HabitType;
  routine: HabitRoutine;
  target: string;
  unit: string;
};

function getInitialState(habit?: HabitRecord | null): FormState {
  if (habit) {
    return {
      title: habit.title,
      category: habit.category,
      color: habit.color,
      type: habit.type,
      routine: habit.routine,
      target: String(habit.target),
      unit: habit.unit ?? "",
    };
  }

  return {
    title: "",
    category: HABIT_CATEGORIES[0],
    color: "emerald",
    type: "boolean",
    routine: "morning",
    target: "1",
    unit: "",
  };
}

export function AddHabitModal({
  isOpen,
  mode,
  initialHabit,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AddHabitModalProps) {
  const [form, setForm] = useState<FormState>(() => getInitialState(initialHabit));
  const isQuantitative = form.type === "quantitative";

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 md:p-6 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0 z-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-4xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-8 py-6">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {mode === "create" ? "New Habit" : "Edit Habit"}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {mode === "create" ? "Design your routine" : "Adjust your setup"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2.5 bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-6 p-6 md:p-8"
          onSubmit={async (event) => {
            event.preventDefault();

            await onSubmit({
              title: form.title,
              category: form.category,
              color: form.color,
              type: form.type,
              routine: form.routine,
              target: isQuantitative ? Number(form.target) : 1,
              unit: isQuantitative ? form.unit : null,
            });
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Habit Name
              </span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="E.g., Read 2 pages after Fajr"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </span>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full appearance-none rounded-2xl border border-border bg-background px-4 py-3 pr-10 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {HABIT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Routine
              </span>
              <div className="relative">
                <select
                  value={form.routine}
                  onChange={(event) => setForm((current) => ({ ...current, routine: event.target.value as HabitRoutine }))}
                  className="w-full appearance-none rounded-2xl border border-border bg-background px-4 py-3 pr-10 text-sm capitalize transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {HABIT_ROUTINES.map((routine) => (
                    <option key={routine} value={routine}>
                      {routine}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2">
                Tracking Style
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "boolean" as const, label: "Done/Skip" },
                  { value: "quantitative" as const, label: "Set target" },
                ].map((option) => {
                  const active = form.type === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          type: option.value,
                          target: option.value === "quantitative" ? current.target || "1" : "1",
                          unit: option.value === "quantitative" ? current.unit : "",
                        }))
                      }
                      className={cn(
                        "rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-all duration-200",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-2 border-l border-border pl-4 md:pl-6">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2">
                Accent Theme
              </legend>
              <div className="flex flex-wrap items-center gap-2">
                {HABIT_COLORS.map((color) => {
                  const isActive = form.color === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, color }))}
                      className={cn(
                        "h-10 w-10 shrink-0 grow-0 rounded-full transition-all duration-200 focus-visible:outline-none focus:ring-2 focus:ring-offset-2",
                        isActive ? "scale-110 shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background" : "scale-100 opacity-80 hover:opacity-100 hover:scale-105",
                        color === "emerald"
                          ? "bg-emerald-500"
                          : color === "amber"
                            ? "bg-amber-500"
                            : color === "rose"
                              ? "bg-rose-500"
                              : color === "blue"
                                ? "bg-blue-500"
                                : "bg-indigo-500"
                      )}
                      aria-label={`Use ${color} accent`}
                    />
                  );
                })}
              </div>
            </fieldset>
          </div>

          {isQuantitative ? (
            <div className="grid gap-4 md:grid-cols-2 rounded-2xl border border-primary/20 bg-primary/5 p-5 animate-in fade-in duration-300">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Daily Target
                </span>
                <input
                  required
                  min={1}
                  max={9999}
                  type="number"
                  value={form.target}
                  onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Unit
                </span>
                <input
                  required
                  value={form.unit}
                  onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
                  placeholder="E.g., pages, sets"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex h-14 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-bold text-foreground transition-all duration-300 hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
              {mode === "create" ? "Create Habit" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
