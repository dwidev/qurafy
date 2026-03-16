"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  HabitMeData,
  SaveHabitPayload,
  UpdateHabitPayload,
  UpsertHabitEntryPayload,
} from "@/features/habits/types";

class HabitsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function fetchHabitsMe(): Promise<HabitMeData> {
  const response = await fetch("/api/habits/me", {
    cache: "no-store",
  });
  const payload = await readJson<HabitMeData & { error?: string }>(response);

  if (!response.ok) {
    throw new HabitsApiError(payload.error ?? "Failed to load habits.", response.status);
  }

  return payload;
}

async function postCreateHabit(input: SaveHabitPayload) {
  const response = await fetch("/api/habits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{ habitId?: string; error?: string }>(response);

  if (!response.ok || !payload.habitId) {
    throw new HabitsApiError(payload.error ?? "Failed to create habit.", response.status);
  }

  return payload;
}

async function patchHabit(input: UpdateHabitPayload) {
  const response = await fetch(`/api/habits/${input.habitId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.title,
      category: input.category,
      color: input.color,
      type: input.type,
      routine: input.routine,
      target: input.target,
      unit: input.unit,
      iconName: input.iconName,
    }),
  });
  const payload = await readJson<{ updated?: boolean; error?: string }>(response);

  if (!response.ok || !payload.updated) {
    throw new HabitsApiError(payload.error ?? "Failed to update habit.", response.status);
  }

  return payload;
}

async function removeHabit(habitId: string) {
  const response = await fetch(`/api/habits/${habitId}`, {
    method: "DELETE",
  });
  const payload = await readJson<{ deleted?: boolean; error?: string }>(response);

  if (!response.ok || !payload.deleted) {
    throw new HabitsApiError(payload.error ?? "Failed to delete habit.", response.status);
  }

  return payload;
}

async function putHabitEntry(input: UpsertHabitEntryPayload) {
  const response = await fetch(`/api/habits/${input.habitId}/entry`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: input.date,
      value: input.value,
    }),
  });
  const payload = await readJson<{ saved?: boolean; error?: string }>(response);

  if (!response.ok || !payload.saved) {
    throw new HabitsApiError(payload.error ?? "Failed to save habit progress.", response.status);
  }

  return payload;
}

export const habitsQueryKeys = {
  me: ["habits", "me"] as const,
};

export function useHabitsMeQuery() {
  return useQuery({
    queryKey: habitsQueryKeys.me,
    queryFn: fetchHabitsMe,
    staleTime: 60_000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      if (error instanceof HabitsApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }

      return failureCount < 2;
    },
  });
}

export function useCreateHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCreateHabit,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: habitsQueryKeys.me });
    },
  });
}

export function useUpdateHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchHabit,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: habitsQueryKeys.me });
    },
  });
}

export function useDeleteHabitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeHabit,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: habitsQueryKeys.me });
    },
  });
}

export function useUpsertHabitEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putHabitEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: habitsQueryKeys.me });
    },
  });
}

export function getHabitsErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    (error.message === "Habits is not ready yet. Apply the latest database migration and try again." ||
      error.message === "Habits is temporarily unavailable in this environment.")
  ) {
    return "Habits is temporarily unavailable in this environment.";
  }

  if (error instanceof HabitsApiError) {
    if (
      error.message === "Habits is not ready yet. Apply the latest database migration and try again." ||
      error.message === "Habits is temporarily unavailable in this environment."
    ) {
      return "Habits is temporarily unavailable in this environment.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}

export function isUnauthorizedHabitsError(error: unknown) {
  return error instanceof HabitsApiError && (error.status === 401 || error.status === 403);
}
