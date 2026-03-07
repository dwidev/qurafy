"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReadContentData, ReadListData } from "@/features/read/types";

class ReadApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchReadList(): Promise<ReadListData> {
  const response = await fetch("/api/read/list");
  const payload = (await response.json()) as ReadListData & { error?: string };

  if (!response.ok) {
    throw new ReadApiError(payload.error ?? "Failed to fetch Quran list.", response.status);
  }

  return payload;
}

async function fetchReadContent(id: string): Promise<ReadContentData> {
  const params = new URLSearchParams({ id });
  const response = await fetch(`/api/read/content?${params.toString()}`);
  const payload = (await response.json()) as ReadContentData & { error?: string };

  if (!response.ok) {
    throw new ReadApiError(payload.error ?? "Failed to fetch Quran content.", response.status);
  }

  return payload;
}

export const readQueryKeys = {
  list: ["read", "list"] as const,
  content: (id: string) => ["read", "content", id] as const,
};

export function useReadListQuery() {
  return useQuery({
    queryKey: readQueryKeys.list,
    queryFn: fetchReadList,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof ReadApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }

      return failureCount < 2;
    },
  });
}

export function useReadContentQuery(id: string) {
  return useQuery({
    queryKey: readQueryKeys.content(id),
    queryFn: () => fetchReadContent(id),
    enabled: id.length > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof ReadApiError && [400, 401, 403, 404].includes(error.status)) {
        return false;
      }

      return failureCount < 2;
    },
  });
}

export function getReadErrorMessage(error: unknown) {
  if (error instanceof ReadApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}

export function isUnauthorizedReadError(error: unknown) {
  return error instanceof ReadApiError && (error.status === 401 || error.status === 403);
}
