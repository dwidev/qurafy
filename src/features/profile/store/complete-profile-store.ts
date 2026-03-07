"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DailyGoalValue, ProfileMeData } from "@/features/profile/types";

type CompleteProfileState = {
  userId: string | null;
  step: number;
  fullName: string;
  username: string;
  location: string;
  dailyGoal: DailyGoalValue;
  bio: string;
};

type CompleteProfileActions = {
  hydrateFromServer: (data: ProfileMeData) => void;
  setStep: (step: number) => void;
  goNextStep: () => void;
  goPrevStep: () => void;
  setFullName: (value: string) => void;
  setUsername: (value: string) => void;
  setLocation: (value: string) => void;
  setDailyGoal: (value: DailyGoalValue) => void;
  setBio: (value: string) => void;
  resetForUser: (userId: string) => void;
};

type CompleteProfileStore = CompleteProfileState & CompleteProfileActions;

const defaultState: CompleteProfileState = {
  userId: null,
  step: 0,
  fullName: "",
  username: "",
  location: "",
  dailyGoal: "build-consistency",
  bio: "",
};

export const useCompleteProfileStore = create<CompleteProfileStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      hydrateFromServer: (data) => {
        const current = get();
        const shouldReset = current.userId !== data.user.id;

        if (shouldReset) {
          set({
            userId: data.user.id,
            step: 0,
            fullName: data.user.name,
            username: data.profile?.username ?? "",
            location: data.profile?.location ?? "",
            dailyGoal: data.profile?.dailyGoal ?? "build-consistency",
            bio: data.profile?.bio ?? "",
          });
          return;
        }

        if (!current.fullName.trim()) {
          set({
            fullName: data.user.name,
          });
        }
      },
      setStep: (step) =>
        set({
          step,
        }),
      goNextStep: () =>
        set((state) => ({
          step: Math.min(4, state.step + 1),
        })),
      goPrevStep: () =>
        set((state) => ({
          step: Math.max(0, state.step - 1),
        })),
      setFullName: (value) =>
        set({
          fullName: value,
        }),
      setUsername: (value) =>
        set({
          username: value,
        }),
      setLocation: (value) =>
        set({
          location: value,
        }),
      setDailyGoal: (value) =>
        set({
          dailyGoal: value,
        }),
      setBio: (value) =>
        set({
          bio: value,
        }),
      resetForUser: (userId) =>
        set({
          ...defaultState,
          userId,
        }),
    }),
    {
      name: "qurafy-complete-profile-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        userId: state.userId,
        step: state.step,
        fullName: state.fullName,
        username: state.username,
        location: state.location,
        dailyGoal: state.dailyGoal,
        bio: state.bio,
      }),
    },
  ),
);
