"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/client";
import type {
  CompleteMemorizeSessionPayload,
  CreateMemorizeGoalPayload,
  MemorizeMeData,
} from "@/features/memorize/types";

class MemorizeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchMemorizeMe(): Promise<MemorizeMeData> {
  const response = await fetch("/api/memorize/me");
  const payload = (await response.json()) as MemorizeMeData & { error?: string };

  if (!response.ok) {
    throw new MemorizeApiError(payload.error ?? "Failed to load memorize data.", response.status);
  }

  return payload;
}

async function postCreateGoal(data: CreateMemorizeGoalPayload): Promise<{ goalId: string }> {
  const response = await fetch("/api/memorize/goal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as { goalId?: string; error?: string };

  if (!response.ok || !payload.goalId) {
    throw new MemorizeApiError(payload.error ?? "Failed to create goal.", response.status);
  }

  return { goalId: payload.goalId };
}

async function postCompleteSession(data: CompleteMemorizeSessionPayload): Promise<{ completed: boolean }> {
  const response = await fetch("/api/memorize/session/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as { completed?: boolean; error?: string };

  if (!response.ok || !payload.completed) {
    throw new MemorizeApiError(payload.error ?? "Failed to complete session.", response.status);
  }

  return { completed: true };
}

export const memorizeQueryKeys = {
  me: ["memorize", "me"] as const,
};

export function useMemorizeMeQuery() {
  return useQuery({
    queryKey: memorizeQueryKeys.me,
    queryFn: fetchMemorizeMe,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof MemorizeApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }

      return failureCount < 2;
    },
  });
}

export function useCreateMemorizeGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCreateGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: memorizeQueryKeys.me });
    },
  });
}

export function useCompleteMemorizeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCompleteSession,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: memorizeQueryKeys.me }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.me }),
      ]);
    },
  });
}

export function getMemorizeErrorMessage(error: unknown) {
  if (error instanceof MemorizeApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}

export function isUnauthorizedMemorizeError(error: unknown) {
  return error instanceof MemorizeApiError && (error.status === 401 || error.status === 403);
}
