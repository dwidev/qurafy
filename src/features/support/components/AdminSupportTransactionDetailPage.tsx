"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Eye, FileText, XCircle } from "lucide-react";
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
  if (!date) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatusBadgeClassName(status: AdminSupportTransactionDetail["status"]) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
  if (status === "rejected" || status === "expired") return "bg-red-50 text-red-700 border-red-200/50";
  return "bg-blue-50 text-blue-700 border-blue-200/50";
}

function formatStatus(status: string) {
  return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
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

  const canReview = transaction?.status === "pending_payment" || transaction?.status === "pending_review";

  async function handleReview(action: "approve" | "reject") {
    if (!transaction) return;
    try {
      await reviewMutation.mutateAsync({
        transactionId: transaction.transactionId,
        action,
        reason: action === "reject" ? rejectReason : undefined,
      });
      router.refresh();
    } catch {
      // Notification handled centrally or logged on error.
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 pb-24 pt-8 md:p-8">
      <div className="space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Transaction Details</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {transaction ? transaction.referenceCode : "Detail Not Found"}
            </h1>
          </div>

          {transaction && (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${getStatusBadgeClassName(transaction.status)}`}>
              {formatStatus(transaction.status)}
            </span>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {transaction && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border/40 bg-muted/30 px-6 py-4 flex items-center justify-between">
                <h2 className="font-medium text-foreground">User Information</h2>
                <span className="inline-flex rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {transaction.kind}
                </span>
              </div>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <p className="text-lg font-medium text-foreground">{transaction.userName}</p>
                  <p className="text-sm text-muted-foreground">{transaction.userEmail}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-3xl font-semibold text-foreground tracking-tight">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="border-b border-border/40 px-6 py-4">
                <h2 className="font-medium text-foreground">Request Properties</h2>
              </div>
              <div className="p-6 grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Billing Cycle</p>
                  <p className="font-medium text-foreground">{transaction.billingCycle ? transaction.billingCycle.charAt(0).toUpperCase() + transaction.billingCycle.slice(1) : "One-time"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Request ID</p>
                  <p className="font-medium text-foreground truncate" title={transaction.requestId}>{transaction.requestId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium text-foreground">{formatDate(transaction.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Submitted At</p>
                  <p className="font-medium text-foreground">{formatDate(transaction.submittedAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expires At</p>
                  <p className="font-medium text-foreground">{formatDate(transaction.expiresAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-foreground">{formatDate(transaction.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="border-b border-border/40 px-6 py-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-medium text-foreground">Proof and Notes</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attached Proof</p>
                  {transaction.proofUrl ? (
                    <Link
                      href={transaction.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <Eye className="h-4 w-4" />
                      View Document
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No proof document uploaded.</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">User Notes</p>
                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-foreground">
                    {transaction.notes || <span className="italic text-muted-foreground">No additional notes provided.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm sticky top-6">
              <div className="border-b border-border/40 px-6 py-4 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-medium text-foreground">Action Center</h2>
              </div>

              <div className="p-6 space-y-6">
                {canReview ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="rejectReason" className="text-sm text-muted-foreground">
                        Rejection reason (optional)
                      </label>
                      <textarea
                        id="rejectReason"
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                        placeholder="Provide details if rejecting..."
                        className="min-h-[100px] w-full resize-y rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => void handleReview("approve")}
                        disabled={reviewMutation.isPending}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleReview("reject")}
                        disabled={reviewMutation.isPending}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/50 bg-muted/50 p-4 text-center">
                    <p className="text-sm font-medium text-foreground mb-1">Review Completed</p>
                    <p className="text-xs text-muted-foreground">This transaction has been finalized.</p>
                  </div>
                )}

                {(transaction.approvedAt || transaction.rejectedAt) && (
                  <div className="pt-4 border-t border-border/40 space-y-3">
                    {transaction.approvedAt && (
                      <div>
                        <p className="text-xs text-muted-foreground">Approved On</p>
                        <p className="text-sm font-medium text-foreground">{formatDate(transaction.approvedAt)}</p>
                      </div>
                    )}
                    {transaction.rejectedAt && (
                      <div>
                        <p className="text-xs text-muted-foreground">Rejected On</p>
                        <p className="text-sm font-medium text-foreground">{formatDate(transaction.rejectedAt)}</p>
                      </div>
                    )}
                  </div>
                )}

                {reviewMutation.isError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 mt-4">
                    {getSupportErrorMessage(reviewMutation.error)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
