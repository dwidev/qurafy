"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardCoordinates, DashboardPrayerData } from "@/features/dashboard/prayer-times/types";

class PrayerTimesApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchPrayerTimes(coordinates: DashboardCoordinates | null): Promise<DashboardPrayerData> {
  const params = new URLSearchParams();

  if (coordinates) {
    params.set("latitude", String(coordinates.latitude));
    params.set("longitude", String(coordinates.longitude));
  }

  const url = params.size > 0 ? `/api/dashboard/prayer-times?${params.toString()}` : "/api/dashboard/prayer-times";
  const response = await fetch(url);
  const payload = (await response.json()) as DashboardPrayerData & { error?: string };

  if (!response.ok) {
    throw new PrayerTimesApiError(payload.error ?? "Failed to fetch prayer data.", response.status);
  }

  return payload;
}

export const prayerTimesQueryKeys = {
  all: ["dashboard", "prayer-times"] as const,
  byCoordinates: (coordinates: DashboardCoordinates | null) => {
    if (!coordinates) {
      return [...prayerTimesQueryKeys.all, "profile"] as const;
    }

    return [
      ...prayerTimesQueryKeys.all,
      `${coordinates.latitude.toFixed(3)},${coordinates.longitude.toFixed(3)}`,
    ] as const;
  },
};

export function usePrayerTimesQuery(coordinates: DashboardCoordinates | null) {
  return useQuery({
    queryKey: prayerTimesQueryKeys.byCoordinates(coordinates),
    queryFn: () => fetchPrayerTimes(coordinates),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof PrayerTimesApiError) {
        if (error.status === 400 || error.status === 401 || error.status === 403) {
          return false;
        }
      }

      return failureCount < 2;
    },
  });
}

export function getPrayerTimesErrorMessage(error: unknown) {
  if (error instanceof PrayerTimesApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}
