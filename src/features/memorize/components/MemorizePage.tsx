"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  Plus,
  X,
  Calendar,
  BookOpen,
  Flame,
  Clock,
  TrendingUp,
  ChevronDown,
  Play,
  Check,
  Settings2,
  Trash2,
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
import type { MemorizeMeData } from "@/features/memorize/types";

/* ─── Static Surah data ──────────────────────────────────────────────── */
const DEFAULT_SURAHS = [
  { n: 1, en: "Al-Fatihah", ar: "ٱلْفَاتِحَة", verses: 7 },
  { n: 78, en: "An-Naba", ar: "ٱلنَّبَإِ", verses: 40 },
  { n: 79, en: "An-Nazi'at", ar: "ٱلنَّٰزِعَٰت", verses: 46 },
  { n: 80, en: "Abasa", ar: "عَبَسَ", verses: 42 },
];

/* ─── Sample verse data for today's target ───────────────────────────── */
const DEFAULT_TODAY_VERSES = [
  { n: 1, ar: "عَمَّ يَتَسَآءَلُونَ", tr: "What are they asking one another about?" },
  { n: 2, ar: "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ", tr: "About the great news —" },
  { n: 3, ar: "ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ", tr: "that over which they are in disagreement." },
  { n: 4, ar: "كَلَّا سَيَعْلَمُونَ", tr: "No! They are going to know." },
  { n: 5, ar: "ثُمَّ كَلَّا سَيَعْلَمُونَ", tr: "Then, no! They are going to know." },
];

const DEFAULT_UPCOMING = [
  { day: "Day 9 · Tomorrow", range: "An-Naba, Verses 11–20", count: 10 },
  { day: "Day 10 · Thu", range: "An-Naba, Verses 21–30", count: 10 },
  { day: "Day 11 · Fri", range: "An-Naba, Verses 31–40", count: 10 },
];

/* ─── Circular progress SVG ─────────────────────────────────────────── */
function CircleProgress({ pct }: { pct: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor"
        strokeWidth="10" className="text-primary transition-all duration-700"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      <text x="50" y="57" textAnchor="middle" className="fill-foreground text-[20px] font-bold rotate-90 origin-center">
        {pct}%
      </text>
    </svg>
  );
}

function buildRangeLabel(surahName: string, startVerse: number, endVerse: number) {
  if (startVerse === endVerse) {
    return `${surahName}, Verse ${startVerse}`;
  }

  return `${surahName}, Verses ${startVerse}-${endVerse}`;
}

const MEMORIZE_SESSION_DONE_STORAGE_KEY = "memorize.session.done";

type MemorizeSessionDoneMarker = {
  dateKey: string;
  goalId: string;
  dayNumber: number;
};

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLocalDateLabel(input = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(input);
}

function readMemorizeSessionDoneMarker(): MemorizeSessionDoneMarker | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as MemorizeSessionDoneMarker;

    if (!parsed?.goalId || !parsed?.dateKey || !Number.isInteger(parsed?.dayNumber)) {
      window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
      return null;
    }

    if (parsed.dateKey !== getLocalDateKey()) {
      window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
    return null;
  }
}

function clearMemorizeSessionDoneMarker() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
}

function GoalSettingsModal({
  goal,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: {
  goal: NonNullable<MemorizeMeData["activeGoal"]>;
  onClose: () => void;
  onSave: (payload: { goalId: string; targetDays: number; repsPerVerse: number }) => Promise<void>;
  onDelete: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}) {
  const minimumTargetDays = Math.max(7, goal.todayTarget?.dayNumber ?? goal.passedDays);
  const maximumTargetDays = Math.max(90, goal.targetDays, minimumTargetDays);
  const [targetDays, setTargetDays] = useState(goal.targetDays);
  const [repsPerVerse, setRepsPerVerse] = useState(goal.repsPerVerse);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    void onSave({
      goalId: goal.id,
      targetDays,
      repsPerVerse,
    });
  };

  const handleDelete = () => {
    void onDelete();
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative z-201 w-full max-w-md rounded-4xl border border-border bg-card p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Goal Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your active memorization goal.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Goal</p>
            <p className="mt-1 text-base font-semibold">{goal.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {goal.surahName}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Target Duration</label>
              <span className="font-bold text-primary">{targetDays} days</span>
            </div>
            <input
              type="range"
              min={minimumTargetDays}
              max={maximumTargetDays}
              step={1}
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
            />
            <p className="text-xs text-muted-foreground">
              Minimum {minimumTargetDays} days based on your current progress.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Repetitions per Verse</label>
              <span className="font-bold text-primary">{repsPerVerse}x</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 3, 5, 7, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setRepsPerVerse(value)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${repsPerVerse === value
                    ? "scale-105 border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50"
                    }`}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || isDeleting}
            className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" /> Delete Goal
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">This deletes all progress. Are you sure?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-10 flex-1 rounded-full bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || isSaving}
                  className="h-10 flex-1 rounded-full bg-destructive text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const [form, setForm] = useState({ title: "", surahIdx: 0, days: 30, reps: 3 });
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

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </span>
            Memorization
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track your Quran memorization progress</p>
        </div>
        {hasActiveGoal && (
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Settings2 className="h-4 w-4" /> Goal Settings
          </button>
        )}
      </div>

      {!hasActiveGoal ? (
        /* ── WELCOME EMPTY STATE ───────────────────────────── */
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
            <div className="h-32 w-32 bg-linear-to-br from-primary/20 to-primary/5 rounded-4xl flex items-center justify-center border border-primary/20 shadow-lg relative z-10 rotate-3 transition-transform hover:rotate-6">
              <BookOpen className="h-16 w-16 text-primary drop-shadow-md" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Start Your Memorization Journey</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-base md:text-lg">
            Build a lasting habit of memorizing the Quran. Choose a target, set your pace, and we&apos;ll guide you step-by-step with interactive daily repetitions.
          </p>
          <button
            onClick={() => setShowGoalModal(true)}
            className="rounded-full bg-primary px-8 py-4 text-primary-foreground font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Create Your First Goal
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left max-w-3xl">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
              <h3 className="font-semibold text-foreground">Set a Target</h3>
              <p className="text-sm text-muted-foreground">Pick a Surah or Juz and choose how many days you want to complete it in.</p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
              <h3 className="font-semibold text-foreground">Guided Repetitions</h3>
              <p className="text-sm text-muted-foreground">Our interactive guide breaks verses down into bite-sized audio repetitions.</p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
              <h3 className="font-semibold text-foreground">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Keep your streak alive and watch your memorization circular ring fill up!</p>
            </div>
          </div>
        </div>
      ) : (
        /* ── ACTIVE GOAL STATE ─────────────────────────────── */
        <>
          {/* Quick stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-500">
            {[
              { icon: Flame, label: "Day Streak", value: `${activeGoal?.currentStreak ?? 0} days`, color: "text-orange-500", bg: "bg-orange-50" },
              { icon: BookOpen, label: "Verses Done", value: `${goal.doneVerses}/${goal.totalVerses}`, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Clock, label: "Days Remaining", value: `${remaining} days`, color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: TrendingUp, label: "Overall Progress", value: `${pct}%`, color: "text-primary", bg: "bg-primary/10" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground leading-none">{label}</p>
                  <p className="text-lg font-bold leading-tight mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Goal Card */}
          <div className="rounded-2xl border border-border bg-linear-to-br from-card to-primary/5 p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-center gap-8">
              <div className="shrink-0 hidden sm:block">
                <CircleProgress pct={pct} />
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Active Goal
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Day {goal.passedDays} of {goal.totalDays} · {remaining} days left
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold truncate">{form.title || goal.title}</h2>
                  <p className="text-muted-foreground text-sm mt-0.5">{selectedSurah?.en || goal.surah}</p>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-2.5 rounded-full bg-linear-to-r from-primary to-primary/70 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.doneVerses} / {goal.totalVerses} verses</span>
                    <span className="font-medium text-primary">{pct}% done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Target (Stack Card) */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-xl font-bold">Today&apos;s Target</h2>

            {showCompletionCard ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:p-8 flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-800">Alhamdulillah!</h3>
                  <p className="text-emerald-700/80 text-sm mt-0.5">You have completed your memorization session.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    startMemorizationSession();
                  }}
                  className="ml-auto h-9 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Continue
                </button>
              </div>
            ) : !activeGoal?.todayTarget ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:p-8 flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-800">Alhamdulillah!</h3>
                  <p className="text-emerald-700/80 text-sm mt-0.5">You have completed today&apos;s memorization target.</p>
                </div>
              </div>
            ) : (
              <div
                className="relative group cursor-pointer pt-4"
                onClick={() => {
                  startMemorizationSession();
                }}
              >
                <div className="absolute inset-x-8 top-0 h-full bg-primary/10 rounded-3xl transition-transform duration-300 group-hover:-translate-y-2" />
                <div className="absolute inset-x-4 top-2 h-full bg-primary/20 rounded-3xl transition-transform duration-300 group-hover:-translate-y-1" />

                <div className="relative rounded-3xl border border-border bg-linear-to-br from-card to-background p-6 md:p-8 shadow-md group-hover:shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-6 z-10 mt-4">
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" /> {todayLabel}
                    </div>
                    <h3 className="text-2xl font-bold">
                      {activeGoal?.surahName || selectedSurah?.en || "An-Naba"}, Verses{" "}
                      {activeGoal?.todayTarget?.startVerse ?? 1}–{activeGoal?.todayTarget?.endVerse ?? 5}
                    </h3>
                    <p className="text-muted-foreground">
                      {TODAY_VERSES.length} verses • {targetReps}× repetitions per verse
                    </p>
                  </div>

                  <button className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-all">
                    <Play className="h-8 w-8 ml-1 fill-white" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Targets */}
          <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <h2 className="text-xl font-bold">Upcoming Targets</h2>
            <div className="space-y-3">
              {UPCOMING.map((u, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-default text-sm md:text-base">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{u.day}</p>
                      <p className="font-semibold mt-0.5">{u.range}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    {u.count} verses
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {/* ── Create Goal Modal ── */}
      {showGoalModal && (
        <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowGoalModal(false);
              setConfirmReplaceGoal(false);
            }}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-background shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
              <div>
                <h3 className="text-lg font-bold">Create New Goal</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Set up your personalized memorization plan</p>
              </div>
              <button
                onClick={() => {
                  setShowGoalModal(false);
                  setConfirmReplaceGoal(false);
                }}
                className="rounded-full p-2 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Goal Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Memorize Juz 30"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>

              {/* Surah Select */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Select Target</label>
                <div className="relative">
                  <select
                    value={safeSurahIdx}
                    onChange={e => setForm({ ...form, surahIdx: Number(e.target.value) })}
                    className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  >
                    {SURAHS.map((s, i) => (
                      <option key={i} value={i}>{s.n}. {s.en} — {s.verses} verses</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Days Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Target Duration</label>
                  <span className="font-bold text-primary">{form.days} days</span>
                </div>
                <input
                  type="range" min={7} max={90} step={1}
                  value={form.days}
                  onChange={e => setForm({ ...form, days: Number(e.target.value) })}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>Fast (7d)</span>
                  <span>Steady (90d)</span>
                </div>
              </div>

              {/* Repetitions */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Repetitions per verse</label>
                  <span className="font-bold text-primary">{form.reps}×</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 3, 5, 7, 10].map(n => (
                    <button
                      key={n}
                      onClick={() => setForm({ ...form, reps: n })}
                      className={`rounded-xl py-2.5 text-sm font-semibold border transition-all ${form.reps === n ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" : "border-border bg-background hover:border-primary/40 text-muted-foreground hover:bg-muted/50"}`}
                    >
                      {n}×
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Summary Card */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 mt-4">
                <h4 className="text-sm font-bold text-primary flex items-center gap-1.5">
                  <Flame className="h-4 w-4" /> Plan Summary
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You will memorize <strong className="text-foreground">{selectedSurah?.en}</strong> over <strong className="text-foreground">{form.days} days</strong>. This requires learning approximately <strong className="text-foreground">{Math.ceil((selectedSurah?.verses || 0) / form.days)} verses</strong> per day, repeating each verse <strong className="text-foreground">{form.reps} times</strong> during training.
                </p>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 flex gap-3 bg-muted/20">
              <button
                onClick={() => {
                  setShowGoalModal(false);
                  setConfirmReplaceGoal(false);
                }}
                className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              {hasActiveGoal && confirmReplaceGoal ? (
                <div className="flex flex-1 gap-3">
                  <button
                    onClick={() => setConfirmReplaceGoal(false)}
                    className="flex-1 rounded-xl bg-secondary py-3 text-sm font-semibold text-foreground hover:bg-secondary/80"
                  >
                    Keep Current Goal
                  </button>
                  <button
                    onClick={() => {
                      void handleCreateGoal();
                    }}
                    disabled={!form.title || createGoalMutation.isPending}
                    className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  >
                    {createGoalMutation.isPending ? "Replacing..." : "Confirm Replace"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (hasActiveGoal) {
                      setConfirmReplaceGoal(true);
                      return;
                    }

                    void handleCreateGoal();
                  }}
                  disabled={!form.title || createGoalMutation.isPending}
                  className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {createGoalMutation.isPending
                    ? "Starting..."
                    : hasActiveGoal
                      ? "Replace Current Goal"
                      : "Start Memorizing"}
                </button>
              )}
            </div>
          </div>
        </div>
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
