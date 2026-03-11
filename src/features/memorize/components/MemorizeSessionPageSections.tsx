"use client";

import { ArrowRight, Check, Mic, Play, Target, Volume2, X } from "lucide-react";
import { PageFeedback } from "@/components/ui/page-feedback";

export const MEMORIZE_SESSION_DONE_STORAGE_KEY = "memorize.session.done";

export type MemorizeSessionPhase = "listening" | "reciting";

export type MemorizeSessionVerse = {
  n: number;
  ar: string;
  tr: string;
};

export function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function MemorizeSessionErrorState({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <PageFeedback
      title="Could not load memorization session"
      message={message}
      tone="error"
      actions={[
        { label: "Retry", onClick: onRetry },
        { label: "Back", onClick: onBack, variant: "secondary" },
      ]}
    />
  );
}

export function MemorizeSessionEmptyState({
  title,
  message,
  actionLabel,
  tone = "neutral",
  onAction,
}: {
  title: string;
  message: string;
  actionLabel: string;
  tone?: "neutral" | "success";
  onAction: () => void;
}) {
  return (
    <PageFeedback
      title={title}
      message={message}
      tone={tone}
      actions={[{ label: actionLabel, onClick: onAction }]}
    />
  );
}

export function MemorizeSessionHeader({
  showProgress,
  currentVerseIndex,
  totalVerses,
  onExit,
}: {
  showProgress: boolean;
  currentVerseIndex: number;
  totalVerses: number;
  onExit: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-foreground/5 p-4 md:p-6">
      <button
        type="button"
        onClick={onExit}
        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
      >
        <X className="h-6 w-6" />
      </button>

      {showProgress ? (
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Memorization Focus</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            {Array.from({ length: totalVerses }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentVerseIndex
                    ? "w-6 bg-primary"
                    : index < currentVerseIndex
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-10" />
      )}

      <div className="w-10" />
    </div>
  );
}

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
    <div className="max-w-md space-y-8 text-center animate-in slide-in-from-bottom-8 duration-500">
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

export function MemorizeSessionPractice({
  currentVerse,
  currentRepetition,
  targetReps,
  phase,
  isSubmitting,
  onPlayAgain,
  onSkipToRecite,
  onCompleteStep,
}: {
  currentVerse: MemorizeSessionVerse;
  currentRepetition: number;
  targetReps: number;
  phase: MemorizeSessionPhase;
  isSubmitting: boolean;
  onPlayAgain: () => void;
  onSkipToRecite: () => void;
  onCompleteStep: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center animate-in zoom-in-95 duration-500">
      <div className="mb-8 flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-muted-foreground">
        Repetition {currentRepetition} of {targetReps}
      </div>

      <div className="relative w-full space-y-8 text-center">
        <span className="pointer-events-none absolute -left-4 -top-12 font-serif text-8xl text-secondary/50 opacity-30">
          “
        </span>
        <span className="pointer-events-none absolute -bottom-16 -right-4 font-serif text-8xl text-secondary/50 opacity-30">
          ”
        </span>

        <p
          className={`text-5xl font-bold leading-tight text-foreground transition-all duration-700 md:text-6xl font-serif ${
            phase === "reciting" ? "scale-95 select-none text-foreground/80 blur-[2px] hover:blur-none" : ""
          }`}
          dir="rtl"
        >
          {currentVerse.ar}
        </p>

        <p className={`text-lg text-muted-foreground transition-all duration-500 md:text-xl ${phase === "reciting" ? "opacity-0" : ""}`}>
          {currentVerse.tr}
        </p>
      </div>

      <div className="mt-16 flex w-full flex-col items-center justify-center space-y-6 sm:mt-24">
        {phase === "listening" ? (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <div className="relative mb-4 flex items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg">
                <Volume2 className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <p className="text-lg font-semibold text-primary">Listening...</p>
            <p className="mt-1 text-sm text-muted-foreground">Focus on the pronunciation</p>

            <button
              type="button"
              onClick={onSkipToRecite}
              className="mt-8 text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Skip & Recite Now
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-card shadow-lg">
              <Mic className="h-7 w-7 animate-pulse text-primary" />
            </div>
            <p className="text-lg font-semibold">Your turn to recite</p>
            <p className="mt-1 text-sm text-muted-foreground">Repeat it aloud from memory</p>

            <div className="mt-8 grid w-full grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onPlayAgain}
                className="rounded-2xl border border-border bg-card py-4 font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Play Again
              </button>
              <button
                type="button"
                onClick={onCompleteStep}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {getNextStepLabel(currentRepetition, targetReps)}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getNextStepLabel(currentRepetition: number, targetReps: number) {
  if (currentRepetition < targetReps) {
    return "Next Repetition";
  }

  return "Complete";
}

export function MemorizeSessionCompletionState({ onDone }: { onDone: () => void }) {
  return (
    <div className="max-w-sm space-y-6 text-center animate-in zoom-in-95 duration-500">
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
