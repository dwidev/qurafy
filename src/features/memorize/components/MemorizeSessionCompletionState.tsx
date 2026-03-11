"use client";

import { Check } from "lucide-react";

export function MemorizeSessionCompletionState({ onDone }: { onDone: () => void }) {
  return (
    <div className="animate-in zoom-in-95 max-w-sm space-y-6 text-center duration-500">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-inner">
        <Check className="h-12 w-12 text-emerald-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground">Alhamdulillah!</h2>
        <p className="mt-2 text-muted-foreground">
          You&apos;ve successfully completed today&apos;s memorization target.
        </p>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="mt-4 w-full rounded-2xl bg-foreground px-8 py-4 font-bold text-background transition-all hover:bg-foreground/90"
      >
        Return to Memorization
      </button>
    </div>
  );
}
