"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Flame,
  Play,
  Plus,
  Settings2,
  Target,
  TrendingUp,
  Trash2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MemorizeMeData } from "@/features/memorize/types";

export const DEFAULT_SURAHS = [
  { n: 1, en: "Al-Fatihah", ar: "ٱلْفَاتِحَة", verses: 7 },
  { n: 78, en: "An-Naba", ar: "ٱلنَّبَإِ", verses: 40 },
  { n: 79, en: "An-Nazi'at", ar: "ٱلنَّٰزِعَٰت", verses: 46 },
  { n: 80, en: "Abasa", ar: "عَبَسَ", verses: 42 },
];

export const DEFAULT_TODAY_VERSES = [
  { n: 1, ar: "عَمَّ يَتَسَآءَلُونَ", tr: "What are they asking one another about?" },
  { n: 2, ar: "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ", tr: "About the great news —" },
  { n: 3, ar: "ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ", tr: "that over which they are in disagreement." },
  { n: 4, ar: "كَلَّا سَيَعْلَمُونَ", tr: "No! They are going to know." },
  { n: 5, ar: "ثُمَّ كَلَّا سَيَعْلَمُونَ", tr: "Then, no! They are going to know." },
];

export const DEFAULT_UPCOMING = [
  { day: "Day 9 · Tomorrow", range: "An-Naba, Verses 11–20", count: 10 },
  { day: "Day 10 · Thu", range: "An-Naba, Verses 21–30", count: 10 },
  { day: "Day 11 · Fri", range: "An-Naba, Verses 31–40", count: 10 },
];

export const MEMORIZE_SESSION_DONE_STORAGE_KEY = "memorize.session.done";

export type MemorizeSessionDoneMarker = {
  dateKey: string;
  goalId: string;
  dayNumber: number;
};

export type MemorizeGoalForm = {
  title: string;
  surahIdx: number;
  days: number;
  reps: number;
};

type MemorizeHeaderProps = {
  hasActiveGoal: boolean;
  onOpenSettings: () => void;
};

type MemorizeStatItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bg: string;
};

type GoalPreview = {
  title: string;
  surah: string;
  totalDays: number;
  passedDays: number;
  totalVerses: number;
  doneVerses: number;
};

type ActiveGoalCardProps = {
  goal: GoalPreview;
  selectedSurahName: string;
  pct: number;
  remainingDays: number;
};

type TodayTargetSectionProps = {
  showCompletionCard: boolean;
  hasTodayTarget: boolean;
  surahName: string;
  startVerse: number;
  endVerse: number;
  versesCount: number;
  targetReps: number;
  todayLabel: string;
  onStartSession: () => void;
};

type CreateGoalModalProps = {
  form: MemorizeGoalForm;
  safeSurahIdx: number;
  selectedSurah: { n: number; en: string; verses: number } | undefined;
  surahs: { n: number; en: string; verses: number }[];
  hasActiveGoal: boolean;
  confirmReplaceGoal: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmReplaceChange: (value: boolean) => void;
  onFormChange: (patch: Partial<MemorizeGoalForm>) => void;
  onSubmit: () => void;
};

type GoalSettingsModalProps = {
  goal: NonNullable<MemorizeMeData["activeGoal"]>;
  onClose: () => void;
  onSave: (payload: { goalId: string; targetDays: number; repsPerVerse: number }) => Promise<void>;
  onDelete: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
};

function CircleProgress({ pct }: { pct: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (pct / 100);

  return (
    <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        className="text-primary transition-all duration-700"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
      />
      <text x="50" y="57" textAnchor="middle" className="origin-center rotate-90 fill-foreground text-[20px] font-bold">
        {pct}%
      </text>
    </svg>
  );
}

export function buildRangeLabel(surahName: string, startVerse: number, endVerse: number) {
  if (startVerse === endVerse) {
    return `${surahName}, Verse ${startVerse}`;
  }

  return `${surahName}, Verses ${startVerse}-${endVerse}`;
}

export function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLocalDateLabel(input = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(input);
}

export function readMemorizeSessionDoneMarker(): MemorizeSessionDoneMarker | null {
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

export function clearMemorizeSessionDoneMarker() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
}

export function GoalSettingsModal({
  goal,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: GoalSettingsModalProps) {
  const minimumTargetDays = Math.max(7, goal.todayTarget?.dayNumber ?? goal.passedDays);
  const maximumTargetDays = Math.max(90, goal.targetDays, minimumTargetDays);
  const [targetDays, setTargetDays] = useState(goal.targetDays);
  const [repsPerVerse, setRepsPerVerse] = useState(goal.repsPerVerse);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300" onClick={onClose} />
      <div className="relative z-201 w-full max-w-md rounded-4xl border border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 md:p-8">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
            <p className="mt-1 text-sm text-muted-foreground">{goal.surahName}</p>
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
              onChange={(event) => setTargetDays(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
            />
            <p className="text-xs text-muted-foreground">Minimum {minimumTargetDays} days based on your current progress.</p>
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
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${repsPerVerse === value ? "scale-105 border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50"}`}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              void onSave({ goalId: goal.id, targetDays, repsPerVerse });
            }}
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
                  onClick={() => {
                    void onDelete();
                  }}
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

export function MemorizeHeader({ hasActiveGoal, onOpenSettings }: MemorizeHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </span>
          Memorization
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your Quran memorization progress</p>
      </div>
      {hasActiveGoal ? (
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
        >
          <Settings2 className="h-4 w-4" /> Goal Settings
        </button>
      ) : null}
    </div>
  );
}

export function MemorizeWelcomeState({ onCreateGoal }: { onCreateGoal: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-500 md:py-24">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="relative z-10 flex h-32 w-32 rotate-3 items-center justify-center rounded-4xl border border-primary/20 bg-linear-to-br from-primary/20 to-primary/5 shadow-lg transition-transform hover:rotate-6">
          <BookOpen className="h-16 w-16 text-primary drop-shadow-md" />
        </div>
      </div>
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Start Your Memorization Journey</h2>
      <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground md:text-lg">
        Build a lasting habit of memorizing the Quran. Choose a target, set your pace, and we&apos;ll guide you step-by-step with interactive daily repetitions.
      </p>
      <button
        onClick={onCreateGoal}
        className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
      >
        <Plus className="h-5 w-5" /> Create Your First Goal
      </button>

      <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {[
          {
            title: "Set a Target",
            description: "Pick a Surah or Juz and choose how many days you want to complete it in.",
          },
          {
            title: "Guided Repetitions",
            description: "Our interactive guide breaks verses down into bite-sized audio repetitions.",
          },
          {
            title: "Track Progress",
            description: "Keep your streak alive and watch your memorization circular ring fill up!",
          },
        ].map((item, index) => (
          <div key={item.title} className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
              {index + 1}
            </div>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemorizeStatsGrid({ items }: { items: MemorizeStatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-500 md:grid-cols-4">
      {items.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs leading-none text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-lg font-bold leading-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActiveGoalCard({ goal, selectedSurahName, pct, remainingDays }: ActiveGoalCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-linear-to-br from-card to-primary/5 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 md:p-8">
      <div className="flex items-center gap-8">
        <div className="hidden shrink-0 sm:block">
          <CircleProgress pct={pct} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Active Goal
            </div>
            <span className="text-xs text-muted-foreground">
              Day {goal.passedDays} of {goal.totalDays} · {remainingDays} days left
            </span>
          </div>
          <div>
            <h2 className="truncate text-2xl font-bold">{goal.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{selectedSurahName || goal.surah}</p>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-2.5 rounded-full bg-linear-to-r from-primary to-primary/70 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {goal.doneVerses} / {goal.totalVerses} verses
              </span>
              <span className="font-medium text-primary">{pct}% done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
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

export function UpcomingTargetsSection({ items }: { items: { day: string; range: string; count: number }[] }) {
  return (
    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <h2 className="text-xl font-bold">Upcoming Targets</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.day}-${index}`}
            className="flex cursor-default items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-sm transition-all hover:border-primary/30 hover:shadow-sm md:text-base"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.day}</p>
                <p className="mt-0.5 font-semibold">{item.range}</p>
              </div>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {item.count} verses
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-background shadow-2xl animate-in slide-in-from-bottom-4">
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

export const memorizeStatIcons = {
  Flame,
  BookOpen,
  Clock,
  TrendingUp,
};
