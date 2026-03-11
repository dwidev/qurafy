"use client";

import { BookOpen, Edit2 } from "lucide-react";
import type { KhatamPlan } from "@/features/tracker/components/trackerPageShared";

type TrackerPageHeaderProps = {
  plan: KhatamPlan | null;
  onOpenEdit: () => void;
};

export function TrackerPageHeader({ plan, onOpenEdit }: TrackerPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </span>
          Khatam Planner
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan ? plan.name : "Track your Quran completion progress"}
        </p>
      </div>

      {plan ? (
        <button
          type="button"
          onClick={onOpenEdit}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90"
        >
          <Edit2 className="h-4 w-4" />
          Plan Settings
        </button>
      ) : null}
    </div>
  );
}
