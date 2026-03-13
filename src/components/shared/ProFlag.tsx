"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type ProFlagProps = {
  billingCycle?: "monthly" | "yearly" | null;
  compact?: boolean;
  className?: string;
};

function getCycleLabel(billingCycle: ProFlagProps["billingCycle"]) {
  if (billingCycle === "yearly") {
    return "Yearly";
  }

  if (billingCycle === "monthly") {
    return "Monthly";
  }

  return null;
}

export function ProFlag({
  billingCycle = null,
  compact = false,
  className,
}: ProFlagProps) {
  const cycleLabel = getCycleLabel(billingCycle);

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700",
          className,
        )}
      >
        <Shield className="h-3 w-3" />
        Pro
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-amber-700",
        className,
      )}
    >
      <Shield className="h-3.5 w-3.5" />
      Pro
      {cycleLabel ? <span className="text-amber-700/70">{cycleLabel}</span> : null}
    </span>
  );
}
