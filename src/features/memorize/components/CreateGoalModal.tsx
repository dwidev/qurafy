"use client";

import { ChevronDown, Flame, X } from "lucide-react";
import type {
  MemorizeGoalForm,
  MemorizeSurah,
} from "@/features/memorize/components/memorizePageShared";

type CreateGoalModalProps = {
  form: MemorizeGoalForm;
  safeSurahIdx: number;
  selectedSurah: MemorizeSurah | undefined;
  surahs: MemorizeSurah[];
  hasActiveGoal: boolean;
  confirmReplaceGoal: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmReplaceChange: (value: boolean) => void;
  onFormChange: (patch: Partial<MemorizeGoalForm>) => void;
  onSubmit: () => void;
};

export function CreateGoalModal({
  form,
  safeSurahIdx,
  selectedSurah,
  surahs,
  hasActiveGoal,
  confirmReplaceGoal,
  isSubmitting,
  onClose,
  onConfirmReplaceChange,
  onFormChange,
  onSubmit,
}: CreateGoalModalProps) {
  return (
    <div className="fixed inset-0 z-200 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-in slide-in-from-bottom-4 relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold">Create New Goal</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Set up your personalized memorization plan</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-muted">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Goal Title</label>
            <input
              type="text"
              placeholder="e.g. Memorize Juz 30"
              value={form.title}
              onChange={(event) => onFormChange({ title: event.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Select Target</label>
            <div className="relative">
              <select
                value={safeSurahIdx}
                onChange={(event) => onFormChange({ surahIdx: Number(event.target.value) })}
                className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {surahs.map((surah, index) => (
                  <option key={surah.n} value={index}>
                    {surah.n}. {surah.en} — {surah.verses} verses
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Target Duration</label>
              <span className="font-bold text-primary">{form.days} days</span>
            </div>
            <input
              type="range"
              min={7}
              max={90}
              step={1}
              value={form.days}
              onChange={(event) => onFormChange({ days: Number(event.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
            />
            <div className="flex justify-between px-1 text-xs text-muted-foreground">
              <span>Fast (7d)</span>
              <span>Steady (90d)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Repetitions per verse</label>
              <span className="font-bold text-primary">{form.reps}×</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 3, 5, 7, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => onFormChange({ reps: value })}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${form.reps === value ? "scale-105 border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50"}`}
                >
                  {value}×
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <Flame className="h-4 w-4" /> Plan Summary
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You will memorize <strong className="text-foreground">{selectedSurah?.en}</strong> over{" "}
              <strong className="text-foreground">{form.days} days</strong>. This requires learning approximately{" "}
              <strong className="text-foreground">{Math.ceil((selectedSurah?.verses || 0) / form.days)} verses</strong>{" "}
              per day, repeating each verse <strong className="text-foreground">{form.reps} times</strong> during training.
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border bg-muted/20 px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
            Cancel
          </button>
          {hasActiveGoal && confirmReplaceGoal ? (
            <div className="flex flex-1 gap-3">
              <button
                onClick={() => onConfirmReplaceChange(false)}
                className="flex-1 rounded-xl bg-secondary py-3 text-sm font-semibold text-foreground hover:bg-secondary/80"
              >
                Keep Current Goal
              </button>
              <button
                onClick={onSubmit}
                disabled={!form.title || isSubmitting}
                className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground transition-all hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Replacing..." : "Confirm Replace"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (hasActiveGoal) {
                  onConfirmReplaceChange(true);
                  return;
                }

                onSubmit();
              }}
              disabled={!form.title || isSubmitting}
              className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Starting..." : hasActiveGoal ? "Replace Current Goal" : "Start Memorizing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
