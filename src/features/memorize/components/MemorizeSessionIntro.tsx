"use client";

import { Play, Target } from "lucide-react";

export function MemorizeSessionIntro({
  surahName,
  startVerse,
  endVerse,
  targetReps,
  onStart,
}: {
  surahName: string;
  startVerse: number;
  endVerse: number;
  targetReps: number;
  onStart: () => void;
}) {
  return (
    <div className="animate-in slide-in-from-bottom-8 max-w-md space-y-8 text-center duration-500">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-inner">
        <Target className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Ready to Memorize?</h2>
        <p className="text-muted-foreground">
          Today&apos;s target: {surahName}, {startVerse}–{endVerse}.
          <br />
          Focus solely on these verses. We will guide you through {targetReps} reps per verse.
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
      >
        <Play className="h-5 w-5 fill-white" />
        Start Session Now
      </button>
    </div>
  );
}
