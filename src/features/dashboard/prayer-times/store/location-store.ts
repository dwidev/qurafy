"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DashboardCoordinates } from "@/features/dashboard/prayer-times/types";

type LocationPermissionState = "idle" | "requesting" | "granted" | "denied" | "unsupported";

type PrayerLocationState = {
  coordinates: DashboardCoordinates | null;
  updatedAt: number | null;
  permission: LocationPermissionState;
  error: string | null;
};

type PrayerLocationActions = {
  setRequesting: () => void;
  setCoordinates: (coordinates: DashboardCoordinates) => void;
  setDenied: (errorMessage: string) => void;
  setUnsupported: () => void;
  clearError: () => void;
};

type PrayerLocationStore = PrayerLocationState & PrayerLocationActions;

export const usePrayerLocationStore = create<PrayerLocationStore>()(
  persist(
    (set) => ({
      coordinates: null,
      updatedAt: null,
      permission: "idle",
      error: null,
      setRequesting: () =>
        set({
          permission: "requesting",
          error: null,
        }),
      setCoordinates: (coordinates) =>
        set({
          coordinates,
          updatedAt: Date.now(),
          permission: "granted",
          error: null,
        }),
      setDenied: (errorMessage) =>
        set({
          permission: "denied",
          error: errorMessage,
        }),
      setUnsupported: () =>
        set({
          permission: "unsupported",
          error: "Geolocation is not supported on this browser.",
        }),
      clearError: () =>
        set({
          error: null,
        }),
    }),
    {
      name: "qurafy-prayer-location-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        coordinates: state.coordinates,
        updatedAt: state.updatedAt,
      }),
    },
  ),
);

export const usePrayerCoordinates = () => usePrayerLocationStore((state) => state.coordinates);
