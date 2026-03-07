"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CompleteProfilePayload, ProfileMeData } from "@/features/profile/types";

class ProfileApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchProfileMe(): Promise<ProfileMeData> {
  const response = await fetch("/api/profile/me");
  const payload = (await response.json()) as ProfileMeData & { error?: string };

  if (!response.ok) {
    throw new ProfileApiError(payload.error ?? "Failed to fetch profile.", response.status);
  }

  return payload;
}

async function postCompleteProfile(data: CompleteProfilePayload): Promise<void> {
  const response = await fetch("/api/profile/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new ProfileApiError(payload.error ?? "Failed to save profile.", response.status);
  }
}

export const profileQueryKeys = {
  me: ["profile", "me"] as const,
};

export function useProfileMeQuery(options?: { initialData?: ProfileMeData }) {
  return useQuery({
    queryKey: profileQueryKeys.me,
    queryFn: fetchProfileMe,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof ProfileApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }

      return failureCount < 2;
    },
    initialData: options?.initialData,
  });
}

export function useCompleteProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCompleteProfile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: profileQueryKeys.me });
      const previous = queryClient.getQueryData<ProfileMeData>(profileQueryKeys.me);

      if (previous) {
        queryClient.setQueryData<ProfileMeData>(profileQueryKeys.me, {
          ...previous,
          user: {
            ...previous.user,
            name: variables.fullName,
          },
          profile: {
            username: variables.username,
            location: variables.location,
            bio: variables.bio,
            dailyGoal: variables.dailyGoal,
            createdAt: previous.profile?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(profileQueryKeys.me, context.previous);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.me });
    },
  });
}

export function getProfileErrorMessage(error: unknown) {
  if (error instanceof ProfileApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}

export function isUnauthorizedProfileError(error: unknown) {
  return error instanceof ProfileApiError && (error.status === 401 || error.status === 403);
}
