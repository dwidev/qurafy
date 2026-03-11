"use client";

import { Calendar, Check, Play } from "lucide-react";
import type { TodayTargetSectionProps } from "@/features/memorize/components/memorizePageShared";

export function TodayTargetSection({
  showCompletionCard,
  hasTodayTarget,
  surahName,
  startVerse,
  endVerse,
  versesCount,
  targetReps,
  todayLabel,
  onStartSession,
}: TodayTargetSectionProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3 duration-500 delay-200">
      <h2 className="text-xl font-bold">Today&apos;s Target</h2>

      {showCompletionCard ? (
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm md:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Alhamdulillah!</h3>
            <p className="mt-0.5 text-sm text-emerald-700/80">You have completed your memorization session.</p>
          </div>
          <button
            type="button"
            onClick={onStartSession}
            className="ml-auto h-9 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700"
          >
            Continue
          </button>
        </div>
      ) : !hasTodayTarget ? (
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm md:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Alhamdulillah!</h3>
            <p className="mt-0.5 text-sm text-emerald-700/80">You have completed today&apos;s memorization target.</p>
          </div>
        </div>
      ) : (
        <div className="group relative cursor-pointer pt-4" onClick={onStartSession}>
          <div className="absolute inset-x-8 top-0 h-full rounded-3xl bg-primary/10 transition-transform duration-300 group-hover:-translate-y-2" />
          <div className="absolute inset-x-4 top-2 h-full rounded-3xl bg-primary/20 transition-transform duration-300 group-hover:-translate-y-1" />

          <div className="relative z-10 mt-4 flex flex-col items-center justify-between gap-6 rounded-3xl border border-border bg-linear-to-br from-card to-background p-6 shadow-md transition-all group-hover:shadow-xl sm:flex-row md:p-8">
            <div className="space-y-2 text-center sm:text-left">
              <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> {todayLabel}
              </div>
              <h3 className="text-2xl font-bold">
                {surahName}, Verses {startVerse}–{endVerse}
              </h3>
              <p className="text-muted-foreground">
                {versesCount} verses • {targetReps}× repetitions per verse
              </p>
            </div>

            <button className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all group-hover:scale-110 group-active:scale-95 md:h-20 md:w-20">
              <Play className="ml-1 h-8 w-8 fill-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
