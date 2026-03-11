"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Clock,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import {
  useDeleteMemorizeGoalMutation,
  getMemorizeErrorMessage,
  isUnauthorizedMemorizeError,
  useCreateMemorizeGoalMutation,
  useMemorizeMeQuery,
  useUpdateMemorizeGoalMutation,
} from "@/features/memorize/api/client";
import { MemorizePageSkeleton } from "@/features/memorize/components/MemorizePageSkeleton";
import {
  ActiveGoalCard,
  buildRangeLabel,
  clearMemorizeSessionDoneMarker,
  CreateGoalModal,
  DEFAULT_SURAHS,
  DEFAULT_TODAY_VERSES,
  DEFAULT_UPCOMING,
  formatLocalDateLabel,
  getLocalDateKey,
  GoalSettingsModal,
  MemorizeHeader,
  MemorizeStatsGrid,
  MemorizeWelcomeState,
  readMemorizeSessionDoneMarker,
  TodayTargetSection,
  UpcomingTargetsSection,
  type MemorizeGoalForm,
  type MemorizeSessionDoneMarker,
} from "@/features/memorize/components/MemorizePageSections";

/* ─── Main page ──────────────────────────────────────────────────────── */
export default function MemorizePage() {
  /* ── State ── */
  const router = useRouter();
  const memorizeQuery = useMemorizeMeQuery();
  const createGoalMutation = useCreateMemorizeGoalMutation();
  const deleteGoalMutation = useDeleteMemorizeGoalMutation();
  const updateGoalMutation = useUpdateMemorizeGoalMutation();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [confirmReplaceGoal, setConfirmReplaceGoal] = useState(false);
  const [form, setForm] = useState<MemorizeGoalForm>({ title: "", surahIdx: 0, days: 30, reps: 3 });
  const [sessionDoneMarker, setSessionDoneMarker] = useState<MemorizeSessionDoneMarker | null>(() =>
    readMemorizeSessionDoneMarker(),
  );

  const data = memorizeQuery.data;
  const activeGoal = data?.activeGoal ?? null;
  const hasActiveGoal = Boolean(activeGoal);
  const SURAHS = data?.surahs ?? DEFAULT_SURAHS;
  const safeSurahIdx = SURAHS[form.surahIdx] ? form.surahIdx : 0;
  const selectedSurah = SURAHS[safeSurahIdx];
  const showCompletionCard = Boolean(
    activeGoal &&
    sessionDoneMarker &&
    sessionDoneMarker.dateKey === getLocalDateKey() &&
    sessionDoneMarker.goalId === activeGoal.id,
  );
  const TODAY_VERSES = activeGoal?.todayTarget
    ? activeGoal.todayTarget.verses.map((verse) => ({
      n: verse.n,
      ar: verse.ar,
      tr: verse.en,
    }))
    : DEFAULT_TODAY_VERSES;
  const baseUpcoming = activeGoal
    ? activeGoal.upcomingTargets.map((item) => ({
      day: item.dayLabel,
      range: item.rangeLabel,
      count: item.count,
    }))
    : DEFAULT_UPCOMING;
  const UPCOMING =
    showCompletionCard && activeGoal?.todayTarget
      ? [
        {
          day: `Day ${activeGoal.todayTarget.dayNumber} · Next Target`,
          range: buildRangeLabel(activeGoal.surahName, activeGoal.todayTarget.startVerse, activeGoal.todayTarget.endVerse),
          count: Math.max(
            1,
            activeGoal.todayTarget.endVerse - activeGoal.todayTarget.startVerse + 1,
          ),
        },
        ...baseUpcoming,
      ].slice(0, 3)
      : baseUpcoming;

  useEffect(() => {
    if (memorizeQuery.error && isUnauthorizedMemorizeError(memorizeQuery.error)) {
      router.replace("/login");
    }
  }, [memorizeQuery.error, router]);

  /* Active Goal Mock Data */
  const goal = activeGoal
    ? {
      title: activeGoal.title,
      surah: activeGoal.surahName,
      totalDays: activeGoal.targetDays,
      passedDays: activeGoal.passedDays,
      totalVerses: activeGoal.totalVerses,
      doneVerses: activeGoal.completedVerses,
    }
    : {
      title: "Juz 30 — Amma",
      surah: "An-Naba & beyond",
      totalDays: 30,
      passedDays: form.title ? 1 : 16,
      totalVerses: selectedSurah?.verses || 110,
      doneVerses: form.title ? 0 : 62,
    };
  const pct = Math.round((goal.doneVerses / goal.totalVerses) * 100) || 0;
  const remaining = goal.totalDays - goal.passedDays;

  const targetReps = activeGoal?.repsPerVerse ?? (form.reps || 3);
  const todayLabel = formatLocalDateLabel();

  function startMemorizationSession() {
    if (!activeGoal?.todayTarget) {
      return;
    }

    clearMemorizeSessionDoneMarker();
    setSessionDoneMarker(null);
    router.push("/app/memorize/session");
  }

  async function handleCreateGoal() {
    if (!form.title || !selectedSurah) {
      return;
    }

    await createGoalMutation.mutateAsync({
      title: form.title,
      surahNumber: selectedSurah.n,
      targetDays: form.days,
      repsPerVerse: form.reps,
    });

    setShowGoalModal(false);
    setConfirmReplaceGoal(false);
    setForm((prev) => ({ ...prev, title: "" }));
    clearMemorizeSessionDoneMarker();
    setSessionDoneMarker(null);
    await memorizeQuery.refetch();
  }

  async function handleDeleteGoal() {
    if (!activeGoal) {
      return;
    }

    await deleteGoalMutation.mutateAsync({ goalId: activeGoal.id });
    setShowSettingsModal(false);
    clearMemorizeSessionDoneMarker();
    setSessionDoneMarker(null);
    await memorizeQuery.refetch();
  }

  async function handleUpdateGoal(payload: { goalId: string; targetDays: number; repsPerVerse: number }) {
    await updateGoalMutation.mutateAsync(payload);
    setShowSettingsModal(false);
    await memorizeQuery.refetch();
  }

  if (memorizeQuery.isError) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h2 className="text-lg font-black">Could not load memorization</h2>
          <p className="text-sm text-muted-foreground">{getMemorizeErrorMessage(memorizeQuery.error)}</p>
          <button
            type="button"
            onClick={() => memorizeQuery.refetch()}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (memorizeQuery.isLoading || !data) {
    return <MemorizePageSkeleton />;
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">
      <MemorizeHeader hasActiveGoal={hasActiveGoal} onOpenSettings={() => setShowSettingsModal(true)} />

      {!hasActiveGoal ? (
        <MemorizeWelcomeState onCreateGoal={() => setShowGoalModal(true)} />
      ) : (
        <>
          <MemorizeStatsGrid
            items={[
              { icon: Flame, label: "Day Streak", value: `${activeGoal?.currentStreak ?? 0} days`, color: "text-orange-500", bg: "bg-orange-50" },
              { icon: BookOpen, label: "Verses Done", value: `${goal.doneVerses}/${goal.totalVerses}`, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Clock, label: "Days Remaining", value: `${remaining} days`, color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: TrendingUp, label: "Overall Progress", value: `${pct}%`, color: "text-primary", bg: "bg-primary/10" },
            ]}
          />

          <ActiveGoalCard
            goal={goal}
            selectedSurahName={selectedSurah?.en || ""}
            pct={pct}
            remainingDays={remaining}
          />

          <TodayTargetSection
            showCompletionCard={showCompletionCard}
            hasTodayTarget={Boolean(activeGoal?.todayTarget)}
            surahName={activeGoal?.surahName || selectedSurah?.en || "An-Naba"}
            startVerse={activeGoal?.todayTarget?.startVerse ?? 1}
            endVerse={activeGoal?.todayTarget?.endVerse ?? 5}
            versesCount={TODAY_VERSES.length}
            targetReps={targetReps}
            todayLabel={todayLabel}
            onStartSession={startMemorizationSession}
          />

          <UpcomingTargetsSection items={UPCOMING} />
        </>
      )}
      {showGoalModal && (
        <CreateGoalModal
          form={form}
          safeSurahIdx={safeSurahIdx}
          selectedSurah={selectedSurah}
          surahs={SURAHS}
          hasActiveGoal={hasActiveGoal}
          confirmReplaceGoal={confirmReplaceGoal}
          isSubmitting={createGoalMutation.isPending}
          onClose={() => {
            setShowGoalModal(false);
            setConfirmReplaceGoal(false);
          }}
          onConfirmReplaceChange={setConfirmReplaceGoal}
          onFormChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          onSubmit={() => {
            void handleCreateGoal();
          }}
        />
      )}
      {showSettingsModal && activeGoal && (
        <GoalSettingsModal
          goal={activeGoal}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleUpdateGoal}
          onDelete={handleDeleteGoal}
          isSaving={updateGoalMutation.isPending}
          isDeleting={deleteGoalMutation.isPending}
        />
      )}
    </div>
  );
}
