"use client";

import { Settings2, Target } from "lucide-react";
import type { MemorizeHeaderProps } from "@/features/memorize/components/memorizePageShared";

export function MemorizeHeader({ hasActiveGoal, onOpenSettings }: MemorizeHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </span>
          Memorization
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your Quran memorization progress</p>
      </div>
      {hasActiveGoal ? (
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
        >
          <Settings2 className="h-4 w-4" /> Goal Settings
        </button>
      ) : null}
    </div>
  );
}
