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
      description: "Awaiting review or approval",
    },
    {
      id: "success",
      label: "Success",
      description: "Approved and activated requests",
    },
    {
      id: "cancel",
      label: "Cancel",
      description: "Rejected or expired requests",
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
  if (!date) return "Not submitted yet";

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
      badgeClassName: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    };
  }

  if (tab === "cancel") {
    return {
      icon: XCircle,
      iconClassName: "text-red-600",
      badgeClassName: "bg-red-50 text-red-700 border-red-200/50",
    };
  }

  return {
    icon: Clock3,
    iconClassName: "text-blue-600",
    badgeClassName: "bg-blue-50 text-blue-700 border-blue-200/50",
  };
}

function getTransactionTone(status: AdminSupportTransactionItem["status"]) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200/50 block w-fit";
  if (status === "rejected" || status === "expired") return "bg-red-50 text-red-700 border-red-200/50 block w-fit";
  return "bg-blue-50 text-blue-700 border-blue-200/50 block w-fit";
}

function formatStatus(status: string) {
  return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
}

function formatBillingCycle(billingCycle: AdminSupportTransactionItem["billingCycle"]) {
  if (!billingCycle) return "One-time";
  return billingCycle === "monthly" ? "Monthly" : "Yearly";
}

export default function AdminSupportPage() {
  const searchParams = useSearchParams();
  const activeTab = normalizeTab(searchParams.get("tab"));
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminSupportTransactionsQuery(activeTab);
  const activeTabMeta = adminTabs.find((tab) => tab.id === activeTab) ?? adminTabs[0];
  const statusTone = getTabTone(activeTab);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 pb-20 pt-8 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">Support Administration</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Transactions</h1>
            {!isLoading && data && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusTone.badgeClassName}`}>
                <statusTone.icon className={`h-3.5 w-3.5 ${statusTone.iconClassName}`} />
                {data.length} items
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground/80 max-w-2xl">
            Review and manage support requests. Tap any row to view full details and take action.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex h-9 w-full md:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {adminTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={tab.id === "pending" ? "/admin/support" : `/admin/support?tab=${tab.id}`}
              className={`relative flex items-center justify-between rounded-xl border p-4 transition-all ${isActive
                ? "border-primary/20 bg-primary/5 shadow-sm"
                : "border-border/50 bg-card hover:bg-muted/50"
                }`}
            >
              <div className="space-y-1">
                <p className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                  {tab.label}
                </p>
                <p className="text-xs text-muted-foreground">{tab.description}</p>
              </div>
              <ChevronRight className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground/30 mb-4" />
            <p className="text-sm">Loading {activeTabMeta.label.toLowerCase()} requests...</p>
          </div>
        ) : isError ? (
          <div className="m-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {getSupportErrorMessage(error)}
          </div>
        ) : data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-4 ${statusTone.badgeClassName}`}>
              <statusTone.icon className={`h-6 w-6 ${statusTone.iconClassName}`} />
            </div>
            <h3 className="text-base font-medium text-foreground">No {activeTabMeta.label.toLowerCase()} requests</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              New transactions will appear here when they match this status.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="hidden grid-cols-[1.5fr_1fr_120px_120px_140px_40px] gap-4 border-b border-border/40 bg-muted/30 px-6 py-3 text-xs font-medium text-muted-foreground lg:grid">
              <span>Reference & Details</span>
              <span>User</span>
              <span>Plan</span>
              <span>Amount</span>
              <span>Submitted</span>
              <span />
            </div>

            <div className="divide-y divide-border/40">
              {data?.map((item) => (
                <Link
                  key={item.transactionId}
                  href={`/admin/support/${item.transactionId}${activeTab === "pending" ? "" : `?tab=${activeTab}`}`}
                  className="group block transition-colors hover:bg-muted/30"
                >
                  {/* Mobile View */}
                  <div className="p-5 lg:hidden space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${getTransactionTone(item.status)}`}>
                            {formatStatus(item.status)}
                          </span>
                          <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                            {item.kind}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{item.referenceCode}</p>
                        <p className="text-sm text-muted-foreground">{item.userName}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground/70" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
                        <p className="font-medium text-foreground">{formatCurrency(item.amount, item.currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Submitted</p>
                        <p className="font-medium text-foreground">{formatDate(item.submittedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden items-center gap-4 px-6 py-4 lg:grid lg:grid-cols-[1.5fr_1fr_120px_120px_140px_40px]">
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{item.referenceCode}</p>
                        <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${getTransactionTone(item.status)}`}>
                          {formatStatus(item.status)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate" title={item.notes || "No additional notes"}>
                        {item.notes ? item.notes : "No notes"}
                      </span>
                    </div>

                    <div className="space-y-0.5 min-w-0 pr-4">
                      <p className="text-sm text-foreground truncate">{item.userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.userEmail}</p>
                    </div>

                    <div className="text-sm text-foreground">
                      {formatBillingCycle(item.billingCycle)}
                    </div>

                    <div className="text-sm font-medium text-foreground">
                      {formatCurrency(item.amount, item.currency)}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {formatDate(item.submittedAt)}
                    </div>

                    <div className="flex justify-end">
                      <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
