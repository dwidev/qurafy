"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMemorizeErrorMessage,
  isUnauthorizedMemorizeError,
  useCompleteMemorizeSessionMutation,
  useMemorizeMeQuery,
} from "@/features/memorize/api/client";
import { MemorizePageSkeleton } from "@/features/memorize/components/MemorizePageSkeleton";
import {
  getLocalDateKey,
  MEMORIZE_SESSION_DONE_STORAGE_KEY,
  MemorizeSessionCompletionState,
  MemorizeSessionEmptyState,
  MemorizeSessionErrorState,
  MemorizeSessionHeader,
  MemorizeSessionIntro,
  MemorizeSessionPractice,
} from "@/features/memorize/components/MemorizeSessionPageSections";

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
      <MemorizeSessionErrorState
        message={getMemorizeErrorMessage(memorizeQuery.error)}
        onRetry={() => memorizeQuery.refetch()}
        onBack={() => leaveSession(false)}
      />
    );
  }

  if (memorizeQuery.isLoading || !memorizeQuery.data) {
    return <MemorizePageSkeleton />;
  }

  if (!activeGoal) {
    return (
      <MemorizeSessionEmptyState
        title="No active memorization goal"
        message="Create a goal first to start a memorization session."
        actionLabel="Go to Memorization"
        onAction={() => leaveSession(false)}
      />
    );
  }

  if (!todayTarget) {
    return (
      <MemorizeSessionEmptyState
        title="Alhamdulillah!"
        message="You have completed today&apos;s memorization target."
        actionLabel="Back to Memorization"
        tone="success"
        onAction={() => leaveSession(false)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <MemorizeSessionHeader
        showProgress={sessionStarted && !sessionDone}
        currentVerseIndex={currIdx}
        totalVerses={todayVerses.length}
        onExit={() => leaveSession(false)}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center p-6">
        {!sessionStarted && !sessionDone ? (
          <MemorizeSessionIntro
            surahName={activeGoal.surahName}
            startVerse={todayTarget.startVerse}
            endVerse={todayTarget.endVerse}
            targetReps={targetReps}
            onStart={() => setSessionStarted(true)}
          />
        ) : null}

        {sessionStarted && !sessionDone && currentVerse ? (
          <MemorizeSessionPractice
            currentVerse={currentVerse}
            currentRepetition={currRep}
            targetReps={targetReps}
            phase={phase}
            isSubmitting={completeSessionMutation.isPending}
            onPlayAgain={() => setPhase("listening")}
            onSkipToRecite={() => setPhase("reciting")}
            onCompleteStep={handleNext}
          />
        ) : null}

        {sessionDone ? <MemorizeSessionCompletionState onDone={() => leaveSession(true)} /> : null}
      </div>
    </div>
  );
}
