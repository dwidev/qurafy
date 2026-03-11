"use client";

import { CheckCircle2 } from "lucide-react";

type KhatamCompletionCardProps = {
  isPending: boolean;
  error: string | null;
  onComplete: () => void;
};

export function KhatamCompletionCard({ isPending, error, onComplete }: KhatamCompletionCardProps) {
  return (
    <div className="mx-auto mt-12 flex max-w-lg flex-col items-center rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center md:p-8">
      <div className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-bold">Finished Today&apos;s Reading?</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Mark this verse target as complete to update your Khatam Planner progress.
      </p>
      <button
        onClick={onComplete}
        disabled={isPending}
        className="h-12 w-full rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
      >
        {isPending ? "Marking..." : "Mark Completed & Return"}
      </button>
      {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
