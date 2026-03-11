"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function ProfileProCard() {
  return (
    <div className="group/pro relative overflow-hidden rounded-4xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 shadow-xl shadow-primary/5">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-transform duration-700 group-hover/pro:scale-150" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover/pro:rotate-12">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-black">Qurafy Pro</h3>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-primary/60">Premium Features</p>
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
          Donate any amount as sadaqah to unlock Pro features permanently.
        </p>

        <div className="space-y-3">
          {["Donate Any Amount", "Permanent Pro Access", "Supporting Our Mission"].map((feature) => (
            <div key={feature} className="flex items-center gap-2.5 text-xs font-bold text-foreground/80">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {feature}
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/sadaqah"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-sm font-black text-primary shadow-sm transition-all hover:bg-primary/10"
          >
            Donate to Unlock Pro
          </Link>
          <Link
            href="/donate"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-amber-500 text-sm font-black text-white shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:bg-amber-600"
          >
            Lifetime Supporter ($49)
          </Link>
        </div>
      </div>
    </div>
  );
}
