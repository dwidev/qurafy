"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  defaultAppearanceSettings,
  defaultNotificationSettings,
  defaultReadingSettings,
  settingsStorageKey,
} from "@/features/settings/constants";
import type {
  AppearanceSettings,
  NotificationSettings,
  ReadingSettings,
  SettingsPageData,
} from "@/features/settings/types";
import type { CompleteProfilePayload } from "@/features/profile/types";

class SettingsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const settingsQueryKeys = {
  me: ["settings", "me"] as const,
};

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function fetchSettingsMe(): Promise<SettingsPageData> {
  const response = await fetch("/api/settings/me", {
    cache: "no-store",
  });
  const payload = await readJson<SettingsPageData & { error?: string }>(response);

  if (!response.ok) {
    throw new SettingsApiError(payload.error ?? "Failed to load settings.", response.status);
  }

  return payload;
}

async function saveSettingsPreferences(input: {
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  reading: ReadingSettings;
}) {
  const response = await fetch("/api/settings/preferences", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{ ok?: boolean; error?: string }>(response);

  if (!response.ok) {
    throw new SettingsApiError(payload.error ?? "Failed to save preferences.", response.status);
  }

  return payload;
}

async function saveAccountSettings(input: CompleteProfilePayload) {
  const response = await fetch("/api/profile/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{ ok?: boolean; error?: string }>(response);

  if (!response.ok) {
    throw new SettingsApiError(payload.error ?? "Failed to save account settings.", response.status);
  }

  return payload;
}

async function logoutAllSessions() {
  const response = await fetch("/api/settings/security/logout-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const payload = await readJson<{ ok?: boolean; error?: string }>(response);

  if (!response.ok) {
    throw new SettingsApiError(payload.error ?? "Failed to log out all sessions.", response.status);
  }

  return payload;
}

async function deleteAccount(confirmation: string) {
  const response = await fetch("/api/settings/account", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ confirmation }),
  });
  const payload = await readJson<{ ok?: boolean; error?: string }>(response);

  if (!response.ok) {
    throw new SettingsApiError(payload.error ?? "Failed to delete account.", response.status);
  }

  return payload;
}

export function persistSettingsLocally(input: {
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  reading: ReadingSettings;
}) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(settingsStorageKey, JSON.stringify(input));
}

export function readPersistedSettings() {
  if (typeof window === "undefined") {
    return {
      notifications: defaultNotificationSettings,
      appearance: defaultAppearanceSettings,
      reading: defaultReadingSettings,
    };
  }

  const raw = window.localStorage.getItem(settingsStorageKey);

  if (!raw) {
    return {
      notifications: defaultNotificationSettings,
      appearance: defaultAppearanceSettings,
      reading: defaultReadingSettings,
    };
  }

  try {
    const parsed = JSON.parse(raw) as {
      notifications: NotificationSettings;
      appearance?: Partial<AppearanceSettings>;
      reading: ReadingSettings;
    };

    return {
      notifications: parsed.notifications ?? defaultNotificationSettings,
      appearance: {
        ...defaultAppearanceSettings,
        ...(parsed.appearance ?? {}),
      },
      reading: parsed.reading ?? defaultReadingSettings,
    };
  } catch {
    return {
      notifications: defaultNotificationSettings,
      appearance: defaultAppearanceSettings,
      reading: defaultReadingSettings,
    };
  }
}

export function useSettingsPageQuery() {
  return useQuery({
    queryKey: settingsQueryKeys.me,
    queryFn: fetchSettingsMe,
    staleTime: 60_000,
  });
}

export function useSavePreferencesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSettingsPreferences,
    onSuccess: async (_payload, variables) => {
      persistSettingsLocally(variables);
      await queryClient.invalidateQueries({ queryKey: settingsQueryKeys.me });
    },
  });
}

export function useSaveAccountSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAccountSettings,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: settingsQueryKeys.me }),
        queryClient.invalidateQueries({ queryKey: ["profile", "me"] }),
      ]);
    },
  });
}

export function useLogoutAllSessionsMutation() {
  return useMutation({
    mutationFn: logoutAllSessions,
  });
}

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: deleteAccount,
  });
}

export function getSettingsErrorMessage(error: unknown) {
  if (error instanceof SettingsApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}

export function isUnauthorizedSettingsError(error: unknown) {
  return error instanceof SettingsApiError && (error.status === 401 || error.status === 403);
}
