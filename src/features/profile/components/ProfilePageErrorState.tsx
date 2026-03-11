"use client";

export function ProfilePageErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl flex-1 p-4 pb-24 pt-6 md:p-8">
      <div className="space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-black">Could not load profile</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
