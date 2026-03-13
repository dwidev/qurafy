"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, Clock3, RefreshCw, XCircle } from "lucide-react";
import {
  getSupportErrorMessage,
  useAdminSupportTransactionsQuery,
} from "@/features/support/api/client";
import type { AdminSupportTransactionItem, AdminSupportTransactionTab } from "@/features/support/types";

const adminTabs: Array<{
  id: AdminSupportTransactionTab;
  label: string;
  description: string;
}> = [
  {
    id: "pending",
    label: "Pending",
    description: "Awaiting payment proof review or approval.",
  },
  {
    id: "success",
    label: "Success",
    description: "Approved transfers and activated requests.",
  },
  {
    id: "cancel",
    label: "Cancel",
    description: "Rejected or expired transfer requests.",
  },
];

function normalizeTab(value: string | null): AdminSupportTransactionTab {
  if (value === "success" || value === "cancel") {
    return value;
  }

  return "pending";
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not submitted yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getTabTone(tab: AdminSupportTransactionTab) {
  if (tab === "success") {
    return {
      icon: CheckCircle2,
      iconClassName: "text-emerald-600",
      badgeClassName: "bg-emerald-500/10 text-emerald-700",
    };
  }

  if (tab === "cancel") {
    return {
      icon: XCircle,
      iconClassName: "text-destructive",
      badgeClassName: "bg-destructive/10 text-destructive",
    };
  }

  return {
    icon: Clock3,
    iconClassName: "text-amber-700",
    badgeClassName: "bg-amber-500/10 text-amber-700",
  };
}

function getTransactionTone(status: AdminSupportTransactionItem["status"]) {
  if (status === "approved") {
    return "bg-emerald-500/10 text-emerald-700";
  }

  if (status === "rejected" || status === "expired") {
    return "bg-destructive/10 text-destructive";
  }

  return "bg-amber-500/10 text-amber-700";
}

function formatBillingCycle(billingCycle: AdminSupportTransactionItem["billingCycle"]) {
  if (!billingCycle) {
    return "One-time";
  }

  return billingCycle === "monthly" ? "Monthly" : "Yearly";
}

export default function AdminSupportPage() {
  const searchParams = useSearchParams();
  const activeTab = normalizeTab(searchParams.get("tab"));
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminSupportTransactionsQuery(activeTab);
  const activeTabMeta = adminTabs.find((tab) => tab.id === activeTab) ?? adminTabs[0];
  const statusTone = getTabTone(activeTab);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 pb-20 pt-5 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground/50">
            Manual Activation Admin
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">Support Transactions</h1>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${statusTone.badgeClassName}`}
            >
              <statusTone.icon className={`h-3.5 w-3.5 ${statusTone.iconClassName}`} />
              {data?.length ?? 0} items
            </div>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Compact queue for faster review. Open a transaction only when it needs full detail.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold transition-all hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {adminTabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <Link
              key={tab.id}
              href={tab.id === "pending" ? "/admin/support" : `/admin/support?tab=${tab.id}`}
              className={`min-w-[180px] rounded-full border px-4 py-3 transition-all ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-border bg-card hover:border-primary/20 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-black">{tab.label}</p>
                  <p className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {tab.description}
                  </p>
                </div>
                <ChevronRight className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 px-5 py-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50">
              Current Queue
            </p>
            <h2 className="text-xl font-black">{activeTabMeta.label} Transactions</h2>
            <p className="text-sm text-muted-foreground">{activeTabMeta.description}</p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
            Tap any row to open detail
          </p>
        </div>

        {isLoading ? (
          <div className="p-5 text-sm text-muted-foreground">
            Loading {activeTabMeta.label.toLowerCase()} transactions...
          </div>
        ) : null}

        {isError ? (
          <div className="m-5 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 p-6 text-sm font-medium text-destructive">
            {getSupportErrorMessage(error)}
          </div>
        ) : null}

        {!isLoading && !isError && data?.length === 0 ? (
          <div className="m-5 rounded-[1.75rem] border border-dashed border-border bg-muted/10 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <statusTone.icon className={`h-7 w-7 ${statusTone.iconClassName}`} />
            </div>
            <h3 className="mt-4 text-xl font-black">No {activeTabMeta.label} Transactions</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Support requests in this state will appear here once they exist.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && data?.length ? (
          <>
            <div className="hidden grid-cols-[1.2fr_1fr_132px_124px_140px_48px] gap-3 border-b border-border/70 bg-muted/20 px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground/70 lg:grid">
              <span>Reference</span>
              <span>User</span>
              <span>Plan</span>
              <span>Amount</span>
              <span>Submitted</span>
              <span />
            </div>

            <div className="divide-y divide-border/70">
              {data.map((item) => (
                <Link
                  key={item.transactionId}
                  href={`/admin/support/${item.transactionId}${activeTab === "pending" ? "" : `?tab=${activeTab}`}`}
                  className="block px-5 py-4 transition-all hover:bg-muted/25"
                >
                  <div className="space-y-3 lg:hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                            {item.kind}
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getTransactionTone(item.status)}`}>
                            {item.status}
                          </span>
                          {item.billingCycle ? (
                            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                              {formatBillingCycle(item.billingCycle)}
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-base font-black">{item.referenceCode}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.userName} • {item.userEmail}
                        </p>
                      </div>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground/60">
                          Amount
                        </p>
                        <p className="mt-1 font-black">{formatCurrency(item.amount, item.currency)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground/60">
                          Submitted
                        </p>
                        <p className="mt-1 font-black">{formatDate(item.submittedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden items-center gap-3 lg:grid lg:grid-cols-[1.2fr_1fr_132px_124px_140px_48px]">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                          {item.kind}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getTransactionTone(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="truncate text-sm font-black">{item.referenceCode}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.notes ? item.notes : "No note"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.userName}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.userEmail}</p>
                    </div>

                    <div className="text-sm font-bold">{formatBillingCycle(item.billingCycle)}</div>

                    <div className="text-sm font-black">{formatCurrency(item.amount, item.currency)}</div>

                    <div className="text-xs font-medium text-muted-foreground">
                      {formatDate(item.submittedAt)}
                    </div>

                    <div className="flex justify-end">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
