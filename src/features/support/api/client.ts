"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsQueryKeys } from "@/features/settings/api/client";
import type {
  AdminSupportTransactionItem,
  AdminSupportTransactionTab,
  CreateSadaqahDonationPayload,
  CreateSupporterSubscriptionPayload,
  PaymentTransactionSummary,
  SubmitTransactionProofPayload,
  SupporterSubscriptionSummary,
} from "@/features/support/types";

class SupportApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function createSupporterSubscriptionRequest(input: CreateSupporterSubscriptionPayload) {
  const response = await fetch("/api/support/subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{
    ok?: boolean;
    error?: string;
    subscription?: SupporterSubscriptionSummary;
    transaction?: PaymentTransactionSummary;
  }>(response);

  if (!response.ok || !payload.subscription || !payload.transaction) {
    throw new SupportApiError(payload.error ?? "Failed to start supporter plan.", response.status);
  }

  return {
    subscription: payload.subscription,
    transaction: payload.transaction,
  };
}

async function createSadaqahDonationRequest(input: CreateSadaqahDonationPayload) {
  const response = await fetch("/api/support/donation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{
    ok?: boolean;
    error?: string;
    donation?: {
      id: string;
      amount: number;
      createdAt: string;
    };
    transaction?: PaymentTransactionSummary;
  }>(response);

  if (!response.ok || !payload.donation || !payload.transaction) {
    throw new SupportApiError(payload.error ?? "Failed to process sadaqah.", response.status);
  }

  return {
    donation: payload.donation,
    transaction: payload.transaction,
  };
}

async function submitTransactionProofRequest(input: SubmitTransactionProofPayload) {
  const response = await fetch("/api/support/transaction", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{
    ok?: boolean;
    error?: string;
    transaction?: PaymentTransactionSummary;
  }>(response);

  if (!response.ok || !payload.transaction) {
    throw new SupportApiError(payload.error ?? "Failed to submit transfer proof.", response.status);
  }

  return payload.transaction;
}

async function fetchAdminSupportTransactions(tab: AdminSupportTransactionTab) {
  const response = await fetch(`/api/support/admin/transactions?tab=${tab}`, {
    cache: "no-store",
  });
  const payload = await readJson<{
    error?: string;
    transactions?: AdminSupportTransactionItem[];
  }>(response);

  if (!response.ok || !payload.transactions) {
    throw new SupportApiError(payload.error ?? "Failed to load support transactions.", response.status);
  }

  return payload.transactions;
}

async function reviewSupportTransactionRequest(input: {
  transactionId: string;
  action: "approve" | "reject";
  reason?: string;
}) {
  const response = await fetch("/api/support/admin/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readJson<{
    ok?: boolean;
    error?: string;
    transaction?: PaymentTransactionSummary;
  }>(response);

  if (!response.ok || !payload.transaction) {
    throw new SupportApiError(payload.error ?? "Failed to review transaction.", response.status);
  }

  return payload.transaction;
}

export const supportQueryKeys = {
  admin: ["support", "admin"] as const,
  adminTransactions: (tab: AdminSupportTransactionTab) => ["support", "admin", "transactions", tab] as const,
};

export function useCreateSupporterSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupporterSubscriptionRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: settingsQueryKeys.me });
    },
  });
}

export function useCreateSadaqahDonationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSadaqahDonationRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: settingsQueryKeys.me });
    },
  });
}

export function useSubmitTransactionProofMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTransactionProofRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: settingsQueryKeys.me }),
        queryClient.invalidateQueries({ queryKey: supportQueryKeys.admin }),
      ]);
    },
  });
}

export function useAdminSupportTransactionsQuery(tab: AdminSupportTransactionTab) {
  return useQuery({
    queryKey: supportQueryKeys.adminTransactions(tab),
    queryFn: () => fetchAdminSupportTransactions(tab),
    staleTime: 10_000,
  });
}

export function useReviewSupportTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewSupportTransactionRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: supportQueryKeys.admin }),
        queryClient.invalidateQueries({ queryKey: settingsQueryKeys.me }),
      ]);
    },
  });
}

export function getSupportErrorMessage(error: unknown) {
  if (error instanceof SupportApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected support error occurred.";
}

export function isUnauthorizedSupportError(error: unknown) {
  return error instanceof SupportApiError && (error.status === 401 || error.status === 403);
}
