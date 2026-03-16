"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";
import {
  getHabitsErrorMessage,
  isUnauthorizedHabitsError,
  useCreateHabitMutation,
  useDeleteHabitMutation,
  useHabitsMeQuery,
  useUpdateHabitMutation,
  useUpsertHabitEntryMutation,
} from "@/features/habits/api/client";
import { AddHabitModal } from "@/features/habits/components/AddHabitModal";
import { HabitItem } from "@/features/habits/components/HabitItem";
import { PrayerHabitCard } from "@/features/habits/components/PrayerHabitCard";
import { HabitStats } from "@/features/habits/components/HabitStats";
import type { HabitRecord, HabitRoutine, SaveHabitPayload } from "@/features/habits/types";

type StatusFilter = "all" | "pending" | "completed";
const PRAYER_HABIT_TITLES = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as const;

function isGroupedPrayerHabit(habit: HabitRecord) {
  return habit.category === "Prayer" && PRAYER_HABIT_TITLES.includes(habit.title as (typeof PRAYER_HABIT_TITLES)[number]);
}

function HabitsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-[2rem] bg-card" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-52 animate-pulse rounded-[2rem] bg-card" />
        ))}
      </div>
    </div>
  );
}

export function HabitTrackerPage() {
  const router = useRouter();
  const habitsQuery = useHabitsMeQuery();
  const createHabitMutation = useCreateHabitMutation();
  const updateHabitMutation = useUpdateHabitMutation();
  const deleteHabitMutation = useDeleteHabitMutation();
  const upsertEntryMutation = useUpsertHabitEntryMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeRoutine, setActiveRoutine] = useState<"all" | HabitRoutine>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitRecord | null>(null);
  const [pendingEntryHabitId, setPendingEntryHabitId] = useState<string | null>(null);
  const [pendingDeleteHabitId, setPendingDeleteHabitId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (habitsQuery.error && isUnauthorizedHabitsError(habitsQuery.error)) {
      router.replace("/login");
    }
  }, [habitsQuery.error, router]);

  useEffect(() => {
    const categories = habitsQuery.data?.categories ?? [];

    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, habitsQuery.data?.categories]);

  if (habitsQuery.isError) {
    return (
      <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-6">
        <h2 className="text-xl font-black tracking-tight text-foreground">Could not load habits</h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground">{getHabitsErrorMessage(habitsQuery.error)}</p>
        <button
          type="button"
          onClick={() => habitsQuery.refetch()}
          className="mt-4 rounded-2xl bg-foreground px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-background"
        >
          Retry
        </button>
      </div>
    );
  }

  if (habitsQuery.isLoading || !habitsQuery.data) {
    return <HabitsLoadingState />;
  }

  const data = habitsQuery.data;
  const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
  const filteredHabits = data.habits
    .filter((habit) => {
      if (activeCategory !== "All" && habit.category !== activeCategory) {
        return false;
      }

      if (activeRoutine !== "all" && habit.routine !== activeRoutine) {
        return false;
      }

      if (statusFilter === "pending" && habit.isCompletedToday) {
        return false;
      }

      if (statusFilter === "completed" && !habit.isCompletedToday) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return `${habit.title} ${habit.category} ${habit.routine}`.toLowerCase().includes(normalizedSearch);
    })
    .sort((left, right) => {
      if (left.isCompletedToday !== right.isCompletedToday) {
        return left.isCompletedToday ? 1 : -1;
      }

      if (left.routine !== right.routine) {
        return left.routine.localeCompare(right.routine);
      }

      return left.title.localeCompare(right.title);
    });
  const prayerHabits = filteredHabits.filter(isGroupedPrayerHabit);
  const habits = filteredHabits.filter((habit) => !isGroupedPrayerHabit(habit));

  async function handleSubmit(payload: SaveHabitPayload) {
    setActionError(null);

    try {
      if (editingHabit) {
        await updateHabitMutation.mutateAsync({
          ...payload,
          habitId: editingHabit.id,
        });
      } else {
        await createHabitMutation.mutateAsync(payload);
      }

      setEditorOpen(false);
      setEditingHabit(null);
    } catch (error) {
      setActionError(getHabitsErrorMessage(error));
    }
  }

  async function handleSaveProgress(habit: HabitRecord, value: number) {
    setActionError(null);
    setPendingEntryHabitId(habit.id);

    try {
      await upsertEntryMutation.mutateAsync({
        habitId: habit.id,
        value,
      });
    } catch (error) {
      setActionError(getHabitsErrorMessage(error));
    } finally {
      setPendingEntryHabitId(null);
    }
  }

  async function handleDeleteHabit(habit: HabitRecord) {
    if (!window.confirm(`Delete "${habit.title}"? This will remove it from your active habits.`)) {
      return;
    }

    setActionError(null);
    setPendingDeleteHabitId(habit.id);

    try {
      await deleteHabitMutation.mutateAsync(habit.id);

      if (editingHabit?.id === habit.id) {
        setEditorOpen(false);
        setEditingHabit(null);
      }
    } catch (error) {
      setActionError(getHabitsErrorMessage(error));
    } finally {
      setPendingDeleteHabitId(null);
    }
  }

  async function handleQuickAdd(payload: SaveHabitPayload) {
    setActionError(null);

    try {
      await createHabitMutation.mutateAsync(payload);
    } catch (error) {
      setActionError(getHabitsErrorMessage(error));
    }
  }

  return (
    <div className="space-y-8 pb-24">
      <section className="overflow-hidden rounded-[2.25rem] border border-border/60 bg-linear-to-br from-card via-card to-secondary/40 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">Habits</p>
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">Build routines you can keep.</h1>
            <p className="text-base font-medium leading-7 text-muted-foreground">
              Track daily ibadah, reading, and personal routines in one place. Each habit keeps its own streak, weekly
              consistency, and daily progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingHabit(null);
              setEditorOpen(true);
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-foreground px-6 text-sm font-black uppercase tracking-[0.18em] text-background transition-transform active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </button>
        </div>
      </section>

      <HabitStats summary={data.summary} />

      <section className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr]">
          <label className="space-y-2">
            <span className="px-1 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Search</span>
            <input
              value={searchTerm}
              onChange={(event) => startTransition(() => setSearchTerm(event.target.value))}
              placeholder="Find a habit"
              className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium text-foreground outline-hidden transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Category</span>
            <select
              value={activeCategory}
              onChange={(event) => startTransition(() => setActiveCategory(event.target.value))}
              className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium text-foreground outline-hidden transition-colors focus:border-foreground"
            >
              <option value="All">All categories</option>
              {data.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Routine</span>
            <select
              value={activeRoutine}
              onChange={(event) => startTransition(() => setActiveRoutine(event.target.value as "all" | HabitRoutine))}
              className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium capitalize text-foreground outline-hidden transition-colors focus:border-foreground"
            >
              <option value="all">All routines</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="anytime">Anytime</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => startTransition(() => setStatusFilter(event.target.value as StatusFilter))}
              className="h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm font-medium text-foreground outline-hidden transition-colors focus:border-foreground"
            >
              <option value="all">All habits</option>
              <option value="pending">Pending today</option>
              <option value="completed">Completed today</option>
            </select>
          </label>
        </div>

        {actionError ? (
          <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {actionError}
          </div>
        ) : null}
      </section>

      {data.suggestions.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground">Quick start ideas</h2>
              <p className="text-sm font-medium text-muted-foreground">Use a template, then customize it later.</p>
            </div>
            {createHabitMutation.isPending ? <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.suggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                disabled={createHabitMutation.isPending}
                onClick={() =>
                  handleQuickAdd({
                    title: suggestion.label,
                    category: suggestion.category,
                    color: suggestion.color,
                    routine: suggestion.routine,
                    type: suggestion.type,
                    target: suggestion.target,
                    unit: suggestion.unit,
                  })
                }
                className="rounded-[1.75rem] border border-border/60 bg-card px-5 py-4 text-left transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <p className="text-base font-black tracking-tight text-foreground">{suggestion.label}</p>
                <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {suggestion.category} • {suggestion.routine}
                </p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {prayerHabits.length === 0 && habits.length === 0 ? (
        <section className="rounded-[2rem] border border-dashed border-border/60 bg-card px-6 py-16 text-center shadow-inner">
          <h2 className="text-2xl font-black tracking-tight text-foreground">No habits match this view</h2>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Adjust the filters above or create a new habit to start building your routine.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {prayerHabits.length > 0 ? (
            <PrayerHabitCard habits={prayerHabits} pendingHabitId={pendingEntryHabitId} onSaveProgress={handleSaveProgress} />
          ) : null}

          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isSaving={pendingEntryHabitId === habit.id}
              isDeleting={pendingDeleteHabitId === habit.id}
              onSaveProgress={handleSaveProgress}
              onEdit={(selectedHabit) => {
                setEditingHabit(selectedHabit);
                setEditorOpen(true);
              }}
              onDelete={handleDeleteHabit}
            />
          ))}
        </section>
      )}

      <AddHabitModal
        key={editingHabit?.id ?? "create-habit"}
        isOpen={editorOpen}
        mode={editingHabit ? "edit" : "create"}
        initialHabit={editingHabit}
        isSubmitting={createHabitMutation.isPending || updateHabitMutation.isPending}
        onClose={() => {
          setEditorOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
