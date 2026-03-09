"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys, fetchDashboardMe } from "@/features/dashboard/api/client";
import type {
  CreateKhatamPlanPayload,
  DeleteKhatamPlanPayload,
  KhatamMeData,
  ToggleKhatamDayPayload,
  UpdateKhatamPlanPayload,
} from "@/features/tracker/types";

class KhatamApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchKhatamMe(): Promise<KhatamMeData> {
  const response = await fetch("/api/khatam/me");
  const payload = (await response.json()) as KhatamMeData & { error?: string };

  if (!response.ok) {
    throw new KhatamApiError(payload.error ?? "Failed to load khatam data.", response.status);
  }

  return payload;
}

async function postCreatePlan(data: CreateKhatamPlanPayload): Promise<{ planId: string }> {
  const response = await fetch("/api/khatam/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as { planId?: string; error?: string };

  if (!response.ok || !payload.planId) {
    throw new KhatamApiError(payload.error ?? "Failed to create khatam plan.", response.status);
  }

  return {
    planId: payload.planId,
  };
}

async function patchUpdatePlan(data: UpdateKhatamPlanPayload): Promise<{ updated: boolean }> {
  const response = await fetch("/api/khatam/plan", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as { updated?: boolean; error?: string };

  if (!response.ok || !payload.updated) {
    throw new KhatamApiError(payload.error ?? "Failed to update khatam plan.", response.status);
  }

  return {
    updated: true,
  };
}

async function deletePlan(data: DeleteKhatamPlanPayload): Promise<{ deleted: boolean }> {
  const response = await fetch("/api/khatam/plan", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as { deleted?: boolean; error?: string };

  if (!response.ok || !payload.deleted) {
    throw new KhatamApiError(payload.error ?? "Failed to delete khatam plan.", response.status);
  }

  return {
    deleted: true,
  };
}

async function postToggleToday(data: ToggleKhatamDayPayload): Promise<{ completed: boolean }> {
  const response = await fetch("/api/khatam/day/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as { completed?: boolean; error?: string };

  if (!response.ok || !payload.completed) {
    throw new KhatamApiError(payload.error ?? "Failed to update khatam progress.", response.status);
  }

  return {
    completed: true,
  };
}

async function refreshDashboard(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: trackerQueryKeys.me }),
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.me }),
  ]);

  await queryClient.refetchQueries({
    queryKey: dashboardQueryKeys.me,
    type: "all",
  });

  await queryClient.fetchQuery({
    queryKey: dashboardQueryKeys.me,
    queryFn: fetchDashboardMe,
    staleTime: 0,
  });
}

export const trackerQueryKeys = {
  me: ["khatam", "me"] as const,
};

export function useKhatamMeQuery() {
  return useQuery({
    queryKey: trackerQueryKeys.me,
    queryFn: fetchKhatamMe,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof KhatamApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }

      return failureCount < 2;
    },
  });
}

export function useCreateKhatamPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCreatePlan,
    onSuccess: async () => {
      await refreshDashboard(queryClient);
    },
  });
}

export function useUpdateKhatamPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUpdatePlan,
    onSuccess: async () => {
      await refreshDashboard(queryClient);
    },
  });
}

export function useDeleteKhatamPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: async () => {
      await refreshDashboard(queryClient);
    },
  });
}

export function useToggleKhatamDayMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postToggleToday,
    onSuccess: async () => {
      await refreshDashboard(queryClient);
    },
  });
}

export function getKhatamErrorMessage(error: unknown) {
  if (error instanceof KhatamApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}

export function isUnauthorizedKhatamError(error: unknown) {
  return error instanceof KhatamApiError && (error.status === 401 || error.status === 403);
}
