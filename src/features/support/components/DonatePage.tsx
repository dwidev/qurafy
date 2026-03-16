"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, FileText, Heart, ShieldCheck, Zap } from "lucide-react";
import { LoadingPopup } from "@/components/ui/LoadingPopup";
import {
  getSupportErrorMessage,
  isUnauthorizedSupportError,
  useCreateSupporterSubscriptionMutation,
} from "@/features/support/api/client";
import { monthlyPresets, yearlyPresets } from "@/features/support/constants/presets";
import {
  CurrencyInput,
  PresetButtonGrid,
  SupportBackLink,
  SupportFooter,
  SupportHeader,
  SupportShell,
} from "@/features/support/components/SupportPageSections";
import { cn } from "@/lib/utils";

const supporterTerms = {
  monthly: {
    title: "Monthly 70/30 Terms",
    badge: "Monthly",
    items: [
      "This payment is a monthly supporter plan that includes full Qurafy Pro access.",
      "70% of your payment is allocated to Qurafy operations, including product development, hosting, and maintenance.",
      "30% of your payment is reserved for charity allocation under the 70/30 supporter program.",
      "Charity allocations are distributed on the first Friday of each month, and the monthly report is published during the first week. You can review donation reports in Dashboard / Donation / Report.",
      "This plan is different from Pure Sadaqah. Use the separate Sadaqah page for a fully charitable donation flow.",
      "The same 70/30 allocation applies on each recurring monthly billing cycle until you cancel or change your plan.",
    ],
  },
  yearly: {
    title: "Yearly 70/30 Terms",
    badge: "Yearly",
    items: [
      "This payment is a yearly supporter plan that includes full Qurafy Pro access for one billing year.",
      "70% of your payment is allocated to Qurafy operations, including product development, hosting, and maintenance.",
      "30% of your payment is reserved for charity allocation under the 70/30 supporter program.",
      "Charity allocations are distributed on the first Friday of each month, and the monthly report is published during the first week. You can review donation reports in Dashboard / Donation / Report.",
      "This plan is different from Pure Sadaqah. Use the separate Sadaqah page for a fully charitable donation flow.",
      "The 70/30 allocation is applied to the full annual payment when the yearly plan is billed.",
    ],
  },
} as const;

export default function DonatePage() {
  const router = useRouter();
  const createSupporterSubscriptionMutation = useCreateSupporterSubscriptionMutation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [amount, setAmount] = useState<string>("50000");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const presets = billingCycle === "monthly" ? monthlyPresets : yearlyPresets;
  const displayAmount = customAmount || amount;
  const platformAmount = Math.floor(Number(displayAmount) * 0.7);
  const charityAmount = Math.floor(Number(displayAmount) * 0.3);
  const activeTerms = supporterTerms[billingCycle];

  const handleDonate = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    try {
      const subscription = await createSupporterSubscriptionMutation.mutateAsync({
        amount: Number(displayAmount),
        billingCycle,
      });
      router.push(`/transfer?tx=${subscription.transaction.id}`);
    } catch (error) {
      if (isUnauthorizedSupportError(error)) {
        router.push("/login");
        return;
      }

      setFormError(getSupportErrorMessage(error));
    }
  };

  return (
    <SupportShell accent="rose" className="px-6 py-10">
      <SupportBackLink />

      <div className="relative z-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="mb-8">
          <SupportHeader
            icon={Heart}
            iconClassName="h-7 w-7 text-rose-500 fill-rose-500/10"
            title="Qurafy Supporter 70/30"
            description={
              <>
                Choose an amount that includes <span className="text-[13px] font-bold italic tracking-tight text-rose-500">full Pro access</span>.
                <br />
                70% sustains Qurafy and 30% is allocated to charity, while core Quran access stays free.
              </>
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,360px)] lg:items-start lg:justify-center">
          <div className="relative z-10 w-full space-y-6 rounded-4xl border border-border/80 bg-card p-8 shadow-2xl shadow-black/3">
            <form onSubmit={handleDonate} className="space-y-6">
              <div className="flex w-full rounded-2xl border border-border/50 bg-secondary/30 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setBillingCycle("monthly");
                    setAmount("50000");
                  }}
                  className={cn(
                    "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                    billingCycle === "monthly" ? "border border-border/50 bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBillingCycle("yearly");
                    setAmount("500000");
                  }}
                  className={cn(
                    "relative flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                    billingCycle === "yearly" ? "border border-border/50 bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Yearly
                  <span className="absolute -right-1.5 -top-2 rotate-12 whitespace-nowrap rounded-full bg-rose-500 px-1.5 py-0.5 text-[6px] font-black text-white shadow-lg shadow-rose-500/20">
                    SAVE 17%
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                    Choose Support Amount
                  </label>
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-rose-500/70">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    Includes Pro
                  </div>
                </div>
                <PresetButtonGrid
                  presets={presets}
                  selectedValue={amount}
                  customValue={customAmount}
                  onSelect={(value) => {
                    setAmount(value);
                    setCustomAmount("");
                  }}
                />
              </div>

              <CurrencyInput
                value={customAmount}
                onChange={setCustomAmount}
                accentClassName="group-focus-within/input:text-rose-500"
              />

              {formError ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                  {formError}
                </div>
              ) : null}

              <div className="space-y-3 rounded-2xl border border-border/40 bg-secondary/20 p-[18px]">
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.15em] text-muted-foreground/50">
                  <span>{billingCycle === "monthly" ? "Monthly Supporter" : "Yearly Supporter"}</span>
                  <span className="flex items-center gap-1 font-black text-rose-500">70 / 30</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="opacity-70">Selected amount</span>
                    <span>IDR {Number(displayAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="opacity-70">To Qurafy operations</span>
                    <span>IDR {platformAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-black text-rose-500">
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-3 w-3 fill-rose-500/10" />
                      Charity allocation
                    </span>
                    <span>IDR {charityAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <p className="px-1 text-center text-[10px] font-medium italic leading-relaxed text-muted-foreground/60">
                Your selected amount includes Pro access. The 70/30 terms are shown in the panel on the right.
              </p>

              <button
                type="submit"
                disabled={createSupporterSubscriptionMutation.isPending || Number(displayAmount) <= 0}
                className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-rose-500 text-[12px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-500/5 transition-all hover:-translate-y-1 disabled:translate-y-0 disabled:opacity-20"
              >
                {createSupporterSubscriptionMutation.isPending ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Continue to Transfer
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div
            className={cn(
              "w-full rounded-4xl border px-6 py-6 shadow-xl backdrop-blur-sm transition-all duration-500 lg:sticky lg:top-10",
              billingCycle === "monthly"
                ? "border-rose-500/20 bg-linear-to-b from-rose-500/8 to-card/95"
                : "border-amber-500/25 bg-linear-to-b from-amber-500/10 to-card/95",
            )}
          >
            <div key={billingCycle} className="animate-in space-y-5 fade-in slide-in-from-right-6 duration-500">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-background/75">
                    <FileText className={cn("h-5 w-5", billingCycle === "monthly" ? "text-rose-500" : "text-amber-600")} />
                  </div>
                  <p className="pt-3 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/45">Terms & Conditions</p>
                  <h2 className="text-lg font-black tracking-tight text-foreground">{activeTerms.title}</h2>
                </div>
                <div
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em]",
                    billingCycle === "monthly"
                      ? "border-rose-500/20 bg-rose-500/10 text-rose-600"
                      : "border-amber-500/25 bg-amber-500/10 text-amber-700",
                  )}
                >
                  {activeTerms.badge}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-dashed border-border/60 bg-background/55 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/45">70 / 30 Policy</p>
                <div className="mt-3 space-y-3">
                  {activeTerms.items.map((item, index) => (
                    <div key={item} className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black",
                          billingCycle === "monthly"
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-600"
                            : "border-amber-500/25 bg-amber-500/10 text-amber-700",
                        )}
                      >
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SupportFooter
            href="/sadaqah"
            icon={Heart}
            iconClassName="h-3.5 w-3.5 text-emerald-500"
            title="Want to give separately?"
            linkLabel="Pure Sadaqah"
            brandText="DIGITAL EXCELLENCE"
          />
        </div>
      </div>

      <LoadingPopup show={createSupporterSubscriptionMutation.isPending} message="Preparing bank transfer instructions..." />
    </SupportShell>
  );
}
