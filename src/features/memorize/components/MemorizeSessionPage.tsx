"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Mic, Play, Target, Volume2, X } from "lucide-react";
import {
  getMemorizeErrorMessage,
  isUnauthorizedMemorizeError,
  useCompleteMemorizeSessionMutation,
  useMemorizeMeQuery,
} from "@/features/memorize/api/client";
import { MemorizePageSkeleton } from "@/features/memorize/components/MemorizePageSkeleton";

const MEMORIZE_SESSION_DONE_STORAGE_KEY = "memorize.session.done";

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function MemorizeSessionPage() {
  const router = useRouter();
  const memorizeQuery = useMemorizeMeQuery();
  const completeSessionMutation = useCompleteMemorizeSessionMutation();

  const activeGoal = memorizeQuery.data?.activeGoal ?? null;
  const todayTarget = activeGoal?.todayTarget ?? null;
  const todayVerses = todayTarget
    ? todayTarget.verses.map((verse) => ({ n: verse.n, ar: verse.ar, tr: verse.en }))
    : [];

  const [sessionStarted, setSessionStarted] = useState(false);
  const [currIdx, setCurrIdx] = useState(0);
  const [currRep, setCurrRep] = useState(1);
  const [phase, setPhase] = useState<"listening" | "reciting">("listening");
  const [sessionDone, setSessionDone] = useState(false);

  const targetReps = activeGoal?.repsPerVerse ?? 3;
  const currentVerse = todayVerses[currIdx];

  useEffect(() => {
    if (memorizeQuery.error && isUnauthorizedMemorizeError(memorizeQuery.error)) {
      router.replace("/login");
    }
  }, [memorizeQuery.error, router]);

  useEffect(() => {
    if (sessionStarted && !sessionDone && phase === "listening") {
      const timer = setTimeout(() => {
        setPhase("reciting");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sessionStarted, sessionDone, phase, currIdx, currRep]);

  async function completeTodayTarget() {
    if (!activeGoal || !todayTarget || !todayTarget.verses.length) {
      setSessionDone(true);
      return;
    }

    await completeSessionMutation.mutateAsync({
      goalId: activeGoal.id,
      dayNumber: todayTarget.dayNumber,
    });

    setSessionDone(true);
    await memorizeQuery.refetch();
  }

  function handleNext() {
    if (completeSessionMutation.isPending) {
      return;
    }

    if (currRep < targetReps) {
      setCurrRep((value) => value + 1);
      setPhase("listening");
      return;
    }

    if (currIdx < todayVerses.length - 1) {
      setCurrIdx((value) => value + 1);
      setCurrRep(1);
      setPhase("listening");
      return;
    }

    void completeTodayTarget();
  }

  function leaveSession(done: boolean) {
    if (done && activeGoal && todayTarget) {
      window.localStorage.setItem(
        MEMORIZE_SESSION_DONE_STORAGE_KEY,
        JSON.stringify({
          dateKey: getLocalDateKey(),
          goalId: activeGoal.id,
          dayNumber: todayTarget.dayNumber,
        }),
      );
    }

    router.push("/app/memorize");
  }

  if (memorizeQuery.isError) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h2 className="text-lg font-black">Could not load memorization session</h2>
          <p className="text-sm text-muted-foreground">{getMemorizeErrorMessage(memorizeQuery.error)}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => memorizeQuery.refetch()}
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => leaveSession(false)}
              className="h-10 px-4 rounded-lg border border-border bg-background text-sm font-bold hover:bg-muted"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (memorizeQuery.isLoading || !memorizeQuery.data) {
    return <MemorizePageSkeleton />;
  }

  if (!activeGoal) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-black">No active memorization goal</h2>
          <p className="text-sm text-muted-foreground">Create a goal first to start a memorization session.</p>
          <button
            type="button"
            onClick={() => leaveSession(false)}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
          >
            Go to Memorization
          </button>
        </div>
      </div>
    );
  }

  if (!todayTarget) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 space-y-4">
          <h2 className="text-lg font-black text-emerald-800">Alhamdulillah!</h2>
          <p className="text-sm text-emerald-700/80">You have completed today&apos;s memorization target.</p>
          <button
            type="button"
            onClick={() => leaveSession(false)}
            className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
          >
            Back to Memorization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-foreground/5">
        <button onClick={() => leaveSession(false)} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
          <X className="h-6 w-6" />
        </button>
        {sessionStarted && !sessionDone && (
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Memorization Focus</p>
            <div className="flex items-center gap-2 mt-1 justify-center">
              {todayVerses.map((_, index) => (
                <div key={index} className={`h-1.5 rounded-full transition-all ${index === currIdx ? "w-6 bg-primary" : index < currIdx ? "w-2 bg-primary/50" : "w-2 bg-secondary"}`} />
              ))}
            </div>
          </div>
        )}
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {!sessionStarted && !sessionDone && (
          <div className="max-w-md text-center space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Memorize?</h2>
              <p className="text-muted-foreground">
                Today&apos;s target: {activeGoal.surahName}, {todayTarget.startVerse}–
                {todayTarget.endVerse}.
                <br />
                Focus solely on these verses. We will guide you through {targetReps} reps per verse.
              </p>
            </div>
            <button
              onClick={() => setSessionStarted(true)}
              className="w-full rounded-2xl bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Play className="fill-white h-5 w-5" /> Start Session Now
            </button>
          </div>
        )}

        {sessionStarted && !sessionDone && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="mb-8 flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-semibold text-muted-foreground">
              Repetition {currRep} of {targetReps}
            </div>
            <div className="text-center w-full space-y-8 relative">
              <span className="absolute -top-12 -left-4 text-8xl text-secondary/50 font-serif opacity-30 pointer-events-none">“</span>
              <span className="absolute -bottom-16 -right-4 text-8xl text-secondary/50 font-serif opacity-30 pointer-events-none">”</span>

              <p className={`text-5xl md:text-6xl font-serif leading-tight font-bold text-foreground transition-all duration-700 ${phase === "reciting" ? "text-foreground/80 scale-95 blur-[2px] select-none hover:blur-none" : ""}`} dir="rtl">
                {currentVerse.ar}
              </p>

              <p className={`text-lg md:text-xl text-muted-foreground transition-all duration-500 ${phase === "reciting" ? "opacity-0" : ""}`}>
                {currentVerse.tr}
              </p>
            </div>

            <div className="mt-16 sm:mt-24 w-full flex flex-col items-center justify-center space-y-6">
              {phase === "listening" && (
                <div className="flex flex-col items-center animate-in fade-in duration-300">
                  <div className="relative flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <Volume2 className="h-7 w-7 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="font-semibold text-primary text-lg">Listening...</p>
                  <p className="text-sm text-muted-foreground mt-1">Focus on the pronunciation</p>

                  <button onClick={() => setPhase("reciting")} className="mt-8 text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Skip & Recite Now
                  </button>
                </div>
              )}

              {phase === "reciting" && (
                <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-4 duration-500">
                  <div className="h-16 w-16 bg-card border-2 border-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Mic className="h-7 w-7 text-primary animate-pulse" />
                  </div>
                  <p className="font-semibold text-lg">Your turn to recite</p>
                  <p className="text-sm text-muted-foreground mt-1">Repeat it aloud from memory</p>

                  <div className="w-full grid grid-cols-2 gap-4 mt-8">
                    <button onClick={() => setPhase("listening")} className="py-4 rounded-2xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors">
                      Play Again
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={completeSessionMutation.isPending}
                      className="py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {currRep < targetReps ? "Next Repetition" : "Next Verse"} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {sessionDone && (
          <div className="max-w-sm text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Check className="h-12 w-12 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Alhamdulillah!</h2>
              <p className="text-muted-foreground mt-2">You&apos;ve successfully completed today&apos;s memorization target.</p>
            </div>
            <button
              onClick={() => leaveSession(true)}
              className="w-full rounded-2xl bg-foreground px-8 py-4 text-background font-bold hover:bg-foreground/90 transition-all mt-4"
            >
              Return to Memorization
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
