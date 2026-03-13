"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, HandHeart, Shield, Sparkles } from "lucide-react";
import { LoadingPopup } from "@/components/ui/LoadingPopup";
import {
  getSupportErrorMessage,
  isUnauthorizedSupportError,
  useCreateSadaqahDonationMutation,
} from "@/features/support/api/client";
import { sadaqahPresets } from "@/features/support/constants/presets";
import {
  CurrencyInput,
  PresetButtonGrid,
  SupportBackLink,
  SupportFooter,
  SupportHeader,
  SupportShell,
} from "@/features/support/components/SupportPageSections";

export default function SadaqahPage() {
  const router = useRouter();
  const createSadaqahDonationMutation = useCreateSadaqahDonationMutation();
  const [amount, setAmount] = useState<string>("50000");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const displayAmount = customAmount || amount;

  const handleDonate = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    try {
      const donation = await createSadaqahDonationMutation.mutateAsync({
        amount: Number(displayAmount),
      });
      router.push(`/transfer?tx=${donation.transaction.id}`);
    } catch (error) {
      if (isUnauthorizedSupportError(error)) {
        router.push("/login");
        return;
      }

      setFormError(getSupportErrorMessage(error));
    }
  };

  return (
    <SupportShell accent="emerald">
      <SupportBackLink />

      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <SupportHeader
          icon={HandHeart}
          iconClassName="h-7 w-7 text-foreground"
          title="Pure Sadaqah"
          description={
            <>
              Your entire contribution goes directly
              <br />
              to those in need, <span className="text-[13px] font-bold italic tracking-tight text-emerald-600">no platform fees.</span>
            </>
          }
        />

        <div className="w-full space-y-8 rounded-[2.5rem] border border-border/80 bg-card p-8 shadow-2xl shadow-black/3">
          <form onSubmit={handleDonate} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  Select Amount
                </label>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-emerald-600/70">
                  <Shield className="h-2.5 w-2.5" />
                  100% Impact
                </div>
              </div>

              <PresetButtonGrid
                presets={sadaqahPresets}
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
              accentClassName="group-focus-within/input:text-emerald-600"
            />

            {formError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {formError}
              </div>
            ) : null}

            {Number(displayAmount) > 0 ? (
              <div className="pt-2">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Total Pure Sadaqah</p>
                    <p className="text-2xl font-black tracking-tight text-foreground">IDR {Number(displayAmount).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 pb-1">
                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 text-emerald-600/80">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Zero Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[52px]" />
            )}

            <button
              type="submit"
              disabled={createSadaqahDonationMutation.isPending || Number(displayAmount) <= 0}
              className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-foreground text-[12px] font-black uppercase tracking-widest text-background shadow-xl shadow-foreground/5 transition-all hover:-translate-y-1 disabled:translate-y-0 disabled:opacity-20"
            >
              {createSadaqahDonationMutation.isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              ) : (
                <>
                  Continue to Transfer
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <SupportFooter
          href="/donate"
          icon={Sparkles}
          iconClassName="h-3.5 w-3.5 text-rose-500"
          title="Support the platform?"
          linkLabel="Get Qurafy Pro"
          brandText="QURAFY DIGITAL"
        />
      </div>

      <LoadingPopup show={createSadaqahDonationMutation.isPending} message="Preparing bank transfer instructions..." />
    </SupportShell>
  );
}
