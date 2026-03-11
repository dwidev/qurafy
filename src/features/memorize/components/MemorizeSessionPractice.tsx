"use client";

import { ArrowRight, Mic, Volume2 } from "lucide-react";
import type {
  MemorizeSessionPhase,
  MemorizeSessionVerse,
} from "@/features/memorize/components/memorizeSessionShared";

function getNextStepLabel(currentRepetition: number, targetReps: number) {
  if (currentRepetition < targetReps) {
    return "Next Repetition";
  }

  return "Complete";
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
    <div className="animate-in zoom-in-95 mx-auto flex w-full max-w-2xl flex-col items-center duration-500">
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
          className={`font-serif text-5xl font-bold leading-tight text-foreground transition-all duration-700 md:text-6xl ${
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
          <div className="animate-in fade-in flex flex-col items-center duration-300">
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
          <div className="animate-in slide-in-from-bottom-4 flex w-full flex-col items-center duration-500">
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
