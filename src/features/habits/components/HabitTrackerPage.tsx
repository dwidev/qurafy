"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { HabitFilters } from "@/features/habits/components/HabitFilters";
import { HabitItem } from "@/features/habits/components/HabitItem";
import { HabitStats } from "@/features/habits/components/HabitStats";
import { HabitSuggestions } from "@/features/habits/components/HabitSuggestions";
import { HabitTrackerHeader } from "@/features/habits/components/HabitTrackerHeader";
import { HabitTrackerPageSkeleton } from "@/features/habits/components/HabitTrackerPageSkeleton";
import { PrayerHabitCard } from "@/features/habits/components/PrayerHabitCard";
import type { HabitRecord, HabitRoutine, SaveHabitPayload } from "@/features/habits/types";

type StatusFilter = "all" | "pending" | "completed";
const PRAYER_HABIT_TITLES = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as const;

function isGroupedPrayerHabit(habit: HabitRecord) {
  return habit.category === "Prayer" && PRAYER_HABIT_TITLES.includes(habit.title as (typeof PRAYER_HABIT_TITLES)[number]);
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
      <div className="rounded-[2rem] border border-destructive/20 bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Could not load habits</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{getHabitsErrorMessage(habitsQuery.error)}</p>
        <button
          type="button"
          onClick={() => habitsQuery.refetch()}
          className="mt-6 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (habitsQuery.isLoading || !habitsQuery.data) {
    return <HabitTrackerPageSkeleton />;
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
    <div className="space-y-6 pb-28">
      <HabitTrackerHeader
        onAddHabit={() => {
          setEditingHabit(null);
          setEditorOpen(true);
        }}
        filterSlot={
          <HabitFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeRoutine={activeRoutine}
            setActiveRoutine={setActiveRoutine}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categories={data.categories}
          />
        }
      />

      {prayerHabits.length > 0 ? (
        <PrayerHabitCard habits={prayerHabits} pendingHabitId={pendingEntryHabitId} onSaveProgress={handleSaveProgress} />
      ) : null}

      <HabitStats summary={data.summary} />

      {actionError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      ) : null}

      {habits.length === 0 && prayerHabits.length === 0 ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-border/50 bg-card/70 px-6 py-16 text-center shadow-sm">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">No habits match this view</h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            Adjust the filters above or create a new habit to start building your routine today.
          </p>
        </section>
      ) : habits.length > 0 ? (
        <section className="space-y-3">
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
      ) : null}

      <HabitSuggestions
        suggestions={data.suggestions}
        isPending={createHabitMutation.isPending}
        onQuickAdd={handleQuickAdd}
      />

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
