"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardMeData } from "@/features/dashboard/types";

class DashboardApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchDashboardMe(): Promise<DashboardMeData> {
  const response = await fetch("/api/dashboard/me", {
    cache: "no-store",
  });
  console.log(response);
  const payload = (await response.json()) as DashboardMeData & { error?: string };
  console.log(payload);
  if (!response.ok) {
    throw new DashboardApiError(payload.error ?? "Failed to fetch dashboard.", response.status);
  }

  return payload;
}

export const dashboardQueryKeys = {
  me: ["dashboard", "me"] as const,
};

export function useDashboardMeQuery(options?: { initialData?: DashboardMeData }) {
  return useQuery({
    queryKey: dashboardQueryKeys.me,
    queryFn: fetchDashboardMe,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      if (error instanceof DashboardApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }

      return failureCount < 2;
    },
    initialData: options?.initialData,
  });
}

export function getDashboardErrorMessage(error: unknown) {
  if (error instanceof DashboardApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}

export function isUnauthorizedDashboardError(error: unknown) {
  return error instanceof DashboardApiError && (error.status === 401 || error.status === 403);
}
