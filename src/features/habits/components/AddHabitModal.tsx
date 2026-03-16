"use client";

import { useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import type { HabitColor, HabitRecord, HabitRoutine, HabitType, SaveHabitPayload } from "@/features/habits/types";
import { HABIT_CATEGORIES, HABIT_COLORS, HABIT_ROUTINES } from "@/features/habits/types";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground">
              {mode === "create" ? "New Habit" : "Edit Habit"}
            </p>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              {mode === "create" ? "Design your next routine" : "Adjust your habit setup"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-6 p-6"
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
              <span className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Habit Name
              </span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Read 2 pages after Fajr"
                className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium text-foreground outline-hidden transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
              />
            </label>

            <label className="space-y-2">
              <span className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Category
              </span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium text-foreground outline-hidden transition-colors focus:border-foreground"
              >
                {HABIT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Routine
              </span>
              <select
                value={form.routine}
                onChange={(event) => setForm((current) => ({ ...current, routine: event.target.value as HabitRoutine }))}
                className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium capitalize text-foreground outline-hidden transition-colors focus:border-foreground"
              >
                {HABIT_ROUTINES.map((routine) => (
                  <option key={routine} value={routine}>
                    {routine}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="space-y-2">
              <legend className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Tracking Style
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "boolean" as const, label: "Done / not done" },
                  { value: "quantitative" as const, label: "Track a number" },
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
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-colors ${
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border/60 bg-background text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Accent
              </legend>
              <div className="flex flex-wrap gap-3">
                {HABIT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, color }))}
                    className={`h-9 w-9 rounded-full border-2 transition-transform ${
                      form.color === color ? "scale-90 border-foreground" : "border-transparent"
                    } ${
                      color === "emerald"
                        ? "bg-emerald-500"
                        : color === "amber"
                          ? "bg-amber-500"
                          : color === "rose"
                            ? "bg-rose-500"
                            : color === "blue"
                              ? "bg-blue-500"
                              : "bg-indigo-500"
                    }`}
                    aria-label={`Use ${color} accent`}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          {isQuantitative ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Daily Target
                </span>
                <input
                  required
                  min={1}
                  max={9999}
                  type="number"
                  value={form.target}
                  onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium text-foreground outline-hidden transition-colors focus:border-foreground"
                />
              </label>

              <label className="space-y-2">
                <span className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Unit
                </span>
                <input
                  required
                  value={form.unit}
                  onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
                  placeholder="pages, glasses, reps"
                  className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium text-foreground outline-hidden transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
                />
              </label>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-border/60 px-5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 min-w-40 items-center justify-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-black uppercase tracking-[0.18em] text-background transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {mode === "create" ? "Create Habit" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
