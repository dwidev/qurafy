"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, Eye, RefreshCw, XCircle } from "lucide-react";
import {
  getSupportErrorMessage,
  useReviewSupportTransactionMutation,
} from "@/features/support/api/client";
import type { AdminSupportTransactionDetail } from "@/features/support/types";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatusBadgeClassName(status: AdminSupportTransactionDetail["status"]) {
  if (status === "approved") {
    return "bg-emerald-500/10 text-emerald-700";
  }

  if (status === "rejected" || status === "expired") {
    return "bg-destructive/10 text-destructive";
  }

  return "bg-amber-500/10 text-amber-700";
}

export default function AdminSupportTransactionDetailPage({
  transaction,
  errorMessage,
  backHref,
}: {
  transaction: AdminSupportTransactionDetail | null;
  errorMessage?: string | null;
  backHref: string;
}) {
  const router = useRouter();
  const reviewMutation = useReviewSupportTransactionMutation();
  const [rejectReason, setRejectReason] = useState("");
  const canReview =
    transaction?.status === "pending_payment" || transaction?.status === "pending_review";

  async function handleReview(action: "approve" | "reject") {
    if (!transaction) {
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        transactionId: transaction.transactionId,
        action,
        reason: action === "reject" ? rejectReason : undefined,
      });
      router.refresh();
    } catch {
      return;
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 pb-24 pt-6 md:p-8">
      <div className="space-y-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold transition-all hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Back to transaction list
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground/50">
              Manual Activation Admin
            </p>
            <h1 className="text-3xl font-black tracking-tight">
              {transaction ? transaction.referenceCode : "Transaction Detail"}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Review the submitted proof, inspect the request metadata, and update the transaction outcome.
            </p>
          </div>

          {transaction ? (
            <div
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${getStatusBadgeClassName(transaction.status)}`}
            >
              {transaction.status}
            </div>
          ) : null}
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-6 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {transaction ? (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {transaction.kind}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getStatusBadgeClassName(transaction.status)}`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <h2 className="text-xl font-black">{transaction.userName}</h2>
                <p className="text-sm text-muted-foreground">{transaction.userEmail}</p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 px-4 py-3 text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</p>
                <p className="mt-1 text-xl font-black">{formatCurrency(transaction.amount, transaction.currency)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-border bg-muted/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Billing</p>
                <p className="mt-2 text-base font-black">{transaction.billingCycle ?? "One-time"}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Created</p>
                <p className="mt-2 text-base font-black">{formatDate(transaction.createdAt)}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Submitted</p>
                <p className="mt-2 text-base font-black">{formatDate(transaction.submittedAt)}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Request ID</p>
                <p className="mt-2 break-all text-sm font-black">{transaction.requestId}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reference</p>
                <p className="mt-2 text-base font-black">{transaction.referenceCode}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Expires</p>
                <p className="mt-2 text-base font-black">{formatDate(transaction.expiresAt)}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Updated</p>
                <p className="mt-2 text-base font-black">{formatDate(transaction.updatedAt)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                  Proof and Notes
                </p>
                {transaction.proofUrl ? (
                  <Link
                    href={transaction.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  >
                    <Eye className="h-4 w-4" />
                    Open submitted proof
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground">No proof URL submitted yet.</p>
                )}
              </div>

              <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
                {transaction.notes ? transaction.notes : "No admin-facing note submitted yet."}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                Review Actions
              </div>

              {canReview ? (
                <>
                  <textarea
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    placeholder="Optional rejection note"
                    className="min-h-24 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary"
                  />

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => void handleReview("approve")}
                      disabled={reviewMutation.isPending}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleReview("reject")}
                      disabled={reviewMutation.isPending}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-5 text-sm font-bold text-destructive transition-all hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-border bg-muted/10 p-4 text-sm text-muted-foreground">
                  This review is closed. The transaction already has a final status.
                </div>
              )}

              <div className="space-y-3 rounded-2xl border border-border bg-background/70 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-muted-foreground">Approved At</span>
                  <span className="font-black">{formatDate(transaction.approvedAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-muted-foreground">Rejected At</span>
                  <span className="font-black">{formatDate(transaction.rejectedAt)}</span>
                </div>
              </div>

              {reviewMutation.isError ? (
                <p className="text-sm font-medium text-destructive">
                  {getSupportErrorMessage(reviewMutation.error)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
