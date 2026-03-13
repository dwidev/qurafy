"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Check, Clock3, Copy, HeartHandshake, ShieldCheck } from "lucide-react";
import {
  getSupportErrorMessage,
  useSubmitTransactionProofMutation,
} from "@/features/support/api/client";
import {
  SupportBackLink,
  SupportHeader,
  SupportShell,
} from "@/features/support/components/SupportPageSections";
import type { SupportTransferPageData } from "@/features/support/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatStatusLabel(status: SupportTransferPageData["status"]) {
  return `${status[0].toUpperCase()}${status.slice(1)}`;
}

export default function TransferPage({
  data,
  errorMessage,
}: {
  data: SupportTransferPageData | null;
  errorMessage?: string | null;
}) {
  const router = useRouter();
  const submitTransactionProofMutation = useSubmitTransactionProofMutation();
  const isSubscription = data?.kind === "subscription";
  const isApproved = data?.status === "active" || data?.status === "confirmed";
  const transactionStatus = data?.transaction.status;
  const canSubmitProof = Boolean(data) && !isApproved && transactionStatus !== "expired";
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState(data?.transaction.proofUrl ?? "");
  const [notes, setNotes] = useState(data?.transaction.notes ?? "");
  const [proofFeedback, setProofFeedback] = useState<string | null>(null);

  async function handleCopy(accountId: string, accountNumber: string) {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccountId(accountId);
      window.setTimeout(() => {
        setCopiedAccountId((current) => (current === accountId ? null : current));
      }, 1500);
    } catch {
      setCopiedAccountId(null);
    }
  }

  async function handleSubmitProof(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data) {
      return;
    }

    setProofFeedback(null);

    try {
      await submitTransactionProofMutation.mutateAsync({
        transactionId: data.transaction.id,
        proofUrl,
        notes,
      });
      setProofFeedback("Transfer proof submitted. This request is now waiting for admin review.");
      router.refresh();
    } catch (error) {
      setProofFeedback(getSupportErrorMessage(error));
    }
  }

  return (
    <SupportShell accent={isSubscription ? "rose" : "emerald"} className="px-6 py-10">
      <SupportBackLink />

      <div className="relative z-10 w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <SupportHeader
          icon={isSubscription ? ShieldCheck : HeartHandshake}
          iconClassName={isSubscription ? "h-7 w-7 text-rose-500" : "h-7 w-7 text-emerald-600"}
          title={isSubscription ? "Manual Supporter Transfer" : "Manual Sadaqah Transfer"}
          description={
            errorMessage
              ? "We could not load this transfer request."
              : isApproved
                ? "This transfer has already been approved."
                : "Transfer to one of the bank accounts below, then wait for admin confirmation."
          }
        />

        {errorMessage ? (
          <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-6 text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {data ? (
          <div className="space-y-6">
            <div
              className={`overflow-hidden rounded-[2.25rem] border p-6 shadow-xl ${
                isSubscription
                  ? "border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-card to-card"
                  : "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                    Transfer Information
                  </p>
                  <h2 className="text-2xl font-black">
                    {isSubscription ? "Bank Transfer for Pro Supporter Plan" : "Bank Transfer for Pure Sadaqah"}
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Transfer the exact amount below, then keep your proof and request ID ready for manual review.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                      isApproved
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-amber-500/10 text-amber-700"
                    }`}
                  >
                    {formatStatusLabel(data.status)}
                  </span>
                  <span className="rounded-full bg-background/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground shadow-sm">
                    Ref {data.transaction.referenceCode}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <div className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                    Exact Transfer Amount
                  </p>
                  <p className="mt-3 text-4xl font-black tracking-tight">{formatCurrency(data.amount)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                      {isSubscription ? "Supporter Pro" : "Pure Sadaqah"}
                    </span>
                    {data.billingCycle ? (
                      <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                        {data.billingCycle}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-dashed border-border/60 bg-background/70 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                    Quick Steps
                  </p>
                  <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                    <p>1. Copy one bank number below and transfer the exact amount.</p>
                    <p>
                      2. Save your proof of transfer with reference code{" "}
                      <span className="font-black text-foreground">{data.transaction.referenceCode}</span>.
                    </p>
                    <p>
                      3. Admin verifies manually.{" "}
                      {isSubscription ? "Pro access is activated after approval." : "Your donation is confirmed after approval."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {data.bankAccounts.map((account) => {
                  const isCopied = copiedAccountId === account.id;

                  return (
                    <div
                      key={account.id}
                      className="rounded-[1.75rem] border border-border/60 bg-background/80 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                            {account.bankName}
                          </p>
                          <p className="mt-3 text-3xl font-black tracking-tight">{account.accountNumber}</p>
                          <p className="mt-2 text-sm text-muted-foreground">a.n. {account.accountHolder}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleCopy(account.id, account.accountNumber)}
                          className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition-all ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "border border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {isCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                        Transfer Summary
                      </p>
                      <h2 className="text-2xl font-black">
                        {isSubscription ? "Supporter Plan Request" : "Pure Sadaqah Request"}
                      </h2>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                        isApproved
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      {formatStatusLabel(data.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</p>
                      <p className="mt-2 text-xl font-black">{formatCurrency(data.amount)}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</p>
                      <p className="mt-2 text-xl font-black">
                        {isSubscription ? "Supporter Pro" : "Pure Sadaqah"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {isSubscription ? "Billing" : "Reference"}
                      </p>
                      <p className="mt-2 text-xl font-black">
                        {isSubscription && data.billingCycle
                          ? `${data.billingCycle[0].toUpperCase()}${data.billingCycle.slice(1)}`
                          : data.transaction.referenceCode}
                      </p>
                    </div>
                  </div>
                </div>

                {canSubmitProof ? (
                  <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                        Submit Transfer Proof
                      </p>
                      <h2 className="text-xl font-black">Tell Admin You Already Paid</h2>
                    </div>

                    <form onSubmit={handleSubmitProof} className="mt-5 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Proof Link
                        </label>
                        <input
                          type="url"
                          value={proofUrl}
                          onChange={(event) => setProofUrl(event.target.value)}
                          placeholder="https://drive.google.com/... or transfer proof URL"
                          className="h-11 w-full rounded-xl border border-border bg-transparent px-4 text-sm font-medium outline-none transition-all focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Note
                        </label>
                        <textarea
                          value={notes}
                          onChange={(event) => setNotes(event.target.value)}
                          placeholder="Optional note for admin, sender name, transfer time, or reference details"
                          className="min-h-28 w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary"
                        />
                      </div>

                      {proofFeedback ? (
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                            submitTransactionProofMutation.isError
                              ? "border border-destructive/20 bg-destructive/5 text-destructive"
                              : "border border-emerald-500/20 bg-emerald-500/5 text-emerald-700"
                          }`}
                        >
                          {proofFeedback}
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={submitTransactionProofMutation.isPending}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                      >
                        {submitTransactionProofMutation.isPending ? "Submitting..." : "Submit Proof for Review"}
                      </button>
                    </form>
                  </div>
                ) : null}

                <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                      Contact Information
                    </p>
                    <h2 className="text-xl font-black">Need Help Confirming the Transfer?</h2>
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <p className="font-bold text-foreground">{data.contact.email}</p>
                    <p className="font-bold text-foreground">{data.contact.phone}</p>
                    <p className="leading-relaxed text-muted-foreground">
                      Share your reference code{" "}
                      <span className="font-black text-foreground">{data.transaction.referenceCode}</span> and transfer proof when contacting support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                      <Clock3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                        Approval
                      </p>
                      <h2 className="text-lg font-black">
                        {isApproved ? "Already Approved" : "Waiting for Admin Review"}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {isApproved
                      ? isSubscription
                        ? "Your supporter subscription is active. You can review it from Subscription settings."
                        : "Your sadaqah has been confirmed and is now part of your billing history."
                      : "This request stays pending until an admin verifies your transfer manually."}
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      href="/app/settings"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      Open Settings
                    </Link>
                    <Link
                      href={isSubscription ? "/donate" : "/sadaqah"}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-bold transition-all hover:bg-muted"
                    >
                      Back to Support Page
                    </Link>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-dashed border-border bg-card/70 p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
                        Transfer Reminder
                      </p>
                      <h2 className="text-lg font-black">Use the Exact Amount</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Using the exact amount and the correct reference ID makes manual verification faster for the admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </SupportShell>
  );
}
