"use client";

export function TrackerLoadingState() {
  return (
    <div className="mx-auto max-w-5xl flex-1 p-4 pb-24 pt-6 md:p-8">
      <div className="animate-pulse space-y-5 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="h-8 w-56 rounded-lg bg-secondary" />
        <div className="h-4 w-80 rounded bg-secondary" />
        <div className="h-40 w-full rounded-2xl bg-secondary" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 rounded-2xl bg-secondary" />
          <div className="h-48 rounded-2xl bg-secondary" />
        </div>
      </div>
    </div>
  );
}
