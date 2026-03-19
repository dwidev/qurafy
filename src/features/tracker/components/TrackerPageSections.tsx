"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  Flame,
  Play,
  Plus,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import type { KhatamActivePlan, KhatamMeData } from "@/features/tracker/types";

export type KhatamPlan = KhatamActivePlan;

type SetupModalProps = {
  onSave: (payload: { name: string; startJuz: number; targetDate: string }) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
};

type EditModalProps = {
  plan: KhatamPlan;
  onSave: (payload: { planId: string; name: string; targetDate: string }) => Promise<void>;
  onClose: () => void;
  onReset: (payload: { planId: string }) => Promise<void>;
};

type TrackerPageHeaderProps = {
  plan: KhatamPlan | null;
  onOpenEdit: () => void;
  onOpenCreate?: () => void;
};

type TrackerPlanViewProps = {
  plan: KhatamPlan;
  onOpenEdit: () => void;
  onToggleToday: () => Promise<void>;
  isToggling: boolean;
};

export function toDateStr(date: Date) {
  return date.toISOString().split("T")[0];
}

export function today() {
  return toDateStr(new Date());
}

export function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export function addDays(dateStr: string, count: number) {
  const next = new Date(dateStr);
  next.setDate(next.getDate() + count);
  return toDateStr(next);
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatExpiryCountdown(expiresAt: string, nowMs: number) {
  const diffMs = new Date(expiresAt).getTime() - nowMs;

  if (diffMs <= 0) {
    return "Expired";
  }

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / 1_440);
  const hours = Math.floor((totalMinutes % 1_440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `Expires in ${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `Expires in ${hours}h ${minutes}m`;
  }

  return `Expires in ${Math.max(1, minutes)}m`;
}

export function formatBoundaryLabel(surahName: string, surahNumber: number, verse: number) {
  return `${surahName} ${surahNumber}:${verse}`;
}

export function computeSchedule(plan: KhatamPlan) {
  return {
    days: plan.dailyTargets,
    totalDays: plan.totalDays,
  };
}

export function computeStats(plan: KhatamPlan) {
  const { days, totalDays } = computeSchedule(plan);
  const todayStr = today();
  const currentDayIdx = days.findIndex((day) => day.date === todayStr);
  const currentDay = currentDayIdx >= 0 ? currentDayIdx + 1 : totalDays;
  const completedCount = plan.completedDays.length;
  const pct = Math.round((completedCount / totalDays) * 100);
  const todayEntry = days.find((day) => day.date === todayStr);
  const nextUpcomingEntry = days.find((day) => day.date > todayStr && !day.isCompleted);
  const primaryReadEntry =
    todayEntry && !todayEntry.isCompleted ? todayEntry : nextUpcomingEntry ?? todayEntry ?? days.at(-1);

  return {
    currentDay,
    totalDays,
    completedCount,
    pct,
    todayEntry,
    nextUpcomingEntry,
    primaryReadEntry,
    daysLeft: daysBetween(todayStr, plan.targetDate),
    streak: plan.currentStreak,
  };
}

export function TrackerErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl flex-1 p-4 pb-24 pt-6 md:p-8">
      <div className="space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-black">Could not load khatam planner</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export function TrackerLoadingState() {
  return (
    <div className="mx-auto max-w-5xl flex-1 p-4 pb-24 pt-6 md:p-8">
      <div className="animate-pulse space-y-5 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="h-8 w-56 rounded-lg bg-secondary" />
        <div className="h-4 w-80 rounded bg-secondary" />
        <div className="h-32 w-full rounded-2xl bg-secondary" />
        <div className="h-32 w-full rounded-2xl bg-secondary" />
      </div>
    </div>
  );
}

export function TrackerPageHeader({ plan, onOpenEdit, onOpenCreate }: TrackerPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </span>
          Khatam Planner
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan ? plan.name : "Track your Quran completion progress"}
        </p>
      </div>

      {plan ? (
        <button
          type="button"
          onClick={onOpenEdit}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90"
        >
          <Edit2 className="h-4 w-4" />
          Plan Settings
        </button>
      ) : onOpenCreate ? (
        <button
          type="button"
          onClick={onOpenCreate}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      ) : null}
    </div>
  );
}

function WelcomeFeature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
        {number}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function WelcomeState({
  onOpenSetup,
}: {
  onOpenSetup: () => void;
}) {
  return (
    <div className="animate-in fade-in zoom-in-95 py-16 text-center duration-500 md:py-24">
      <div className="relative mb-8 flex justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-4xl border border-primary/20 bg-linear-to-br from-primary/20 to-primary/5 shadow-lg">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
      </div>
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Start Your Khatam Journey</h2>
      <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground md:text-lg">
        Plan your Quran reading and stay on track with daily targets. Set your goal and let Qurafy guide your progress.
      </p>
      <button
        type="button"
        onClick={onOpenSetup}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
      >
        <Plus className="h-5 w-5" />
        Create Khatam Plan
      </button>

      <div className="mx-auto mt-20 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
        <WelcomeFeature
          number="1"
          title="Set a Target"
          description="Pick a start Juz and choose how many days you want to complete the Khatam in."
        />
        <WelcomeFeature
          number="2"
          title="Daily Schedule"
          description="We split your remaining Quran reading into exact daily verse ranges based on your target date."
        />
        <WelcomeFeature
          number="3"
          title="Track Progress"
          description="Mark days as done, build your streak, and watch your Khatam heatmap light up."
        />
      </div>
    </div>
  );
}

export function TrackerEmptyMainState() {
  return (
    <section className="rounded-4xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          No Active Plan
        </div>
        <h2 className="text-2xl font-bold">Start a new khatam plan</h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          Your previous completed and deleted plans are shown below. Use the create button in the header whenever you&apos;re ready to begin again.
        </p>
      </div>
    </section>
  );
}

export function DeletedPlanHistoryPanel({
  historyItems,
  onRecreatePlan,
  recreateHistoryId,
  isRecreating,
}: {
  historyItems: KhatamMeData["deletedPlanHistory"];
  onRecreatePlan: (historyId: string) => Promise<void>;
  recreateHistoryId: string | null;
  isRecreating: boolean;
}) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="space-y-8 py-4">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">Recent History</h3>
          <p className="text-sm text-muted-foreground">Keep track of your past khatam journeys.</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground">
          <RotateCcw className="h-5 w-5" />
        </div>
      </div>

      {historyItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/70 bg-card/30 p-6 text-sm text-muted-foreground">
          Your completed or deleted khatam plans will appear here.
        </div>
      ) : null}

      {historyItems.length > 0 ? (
        <div className="relative space-y-8 pl-4 before:absolute before:bottom-2 before:left-[1.35rem] before:top-2 before:w-px before:bg-border/60">
          {historyItems.map((item) => {
            const isCurrentItem = recreateHistoryId === item.id;
            const isDeleted = item.historyState === "deleted";
            const actionLabel = isDeleted ? "Deleted" : "Finished";
            const dateLabel = isDeleted ? item.deletedAt : item.completedAt;

            return (
              <div key={item.id} className="relative pl-10">
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-1.5 z-10 h-3 w-3 rounded-full border-2 border-background ring-4 ${
                    isDeleted ? "bg-destructive ring-destructive/10" : "bg-emerald-500 ring-emerald-500/10"
                  }`}
                />

                <div className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-card/40 p-5 transition-all hover:border-primary/20 hover:bg-card sm:flex-row sm:items-center">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {dateLabel ? formatShortDate(dateLabel) : "No Date"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                          isDeleted ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {actionLabel}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-foreground">{item.name}</h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Start Juz {item.startJuz}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.completedDays}/{item.totalDays} days</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5" />
                        <span>{item.completedJuz} juz</span>
                      </div>
                    </div>

                    {isDeleted && item.expiresAt ? (
                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary/80">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatExpiryCountdown(item.expiresAt, nowMs)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-2 sm:pt-0">
                    {isDeleted ? (
                      <button
                        type="button"
                        onClick={() => {
                          void onRecreatePlan(item.id);
                        }}
                        disabled={isRecreating}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-6 text-sm font-bold text-background transition-all hover:scale-[1.02] hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50 sm:w-auto"
                      >
                        {isCurrentItem && isRecreating ? "Restoring..." : "Restore Plan"}
                      </button>
                    ) : (
                      <div className="flex h-10 items-center gap-2 rounded-2xl bg-emerald-500/10 px-6 text-sm font-bold text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}



export function SetupModal({ onSave, onClose, isSubmitting }: SetupModalProps) {
  const [name, setName] = useState("Ramadan Challenge");
  const [startJuz, setStartJuz] = useState(1);
  const [targetDays, setTargetDays] = useState(30);
  const [targetDate, setTargetDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 29);
    return toDateStr(next);
  });
  const [useCustomDate, setUseCustomDate] = useState(false);

  const presets = [
    { label: "30 Days", days: 30 },
    { label: "60 Days", days: 60 },
    { label: "90 Days", days: 90 },
    { label: "180 Days", days: 180 },
  ];

  const handlePreset = (days: number) => {
    setTargetDays(days);
    const next = new Date();
    next.setDate(next.getDate() + days - 1);
    setTargetDate(toDateStr(next));
    setUseCustomDate(false);
  };

  const handleCustomDate = (value: string) => {
    setTargetDate(value);
    setUseCustomDate(true);
    setTargetDays(daysBetween(today(), value) + 1);
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300" onClick={onClose} />
      <div className="relative z-201 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-4xl border border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold">New Plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">Configure your Khatam schedule.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-base outline-none transition-colors focus:border-primary"
              placeholder="e.g. Daily Check-in"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start From Juz</label>
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 15, 20, 25, 29].map((juz) => (
                <button
                  key={juz}
                  type="button"
                  onClick={() => setStartJuz(juz)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    startJuz === juz ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {juz}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Or custom:</span>
              <input
                type="number"
                min={1}
                max={30}
                value={startJuz}
                onChange={(event) => setStartJuz(Math.min(30, Math.max(1, Number(event.target.value))))}
                className="w-16 rounded-xl border border-border bg-transparent px-3 py-2 text-center text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handlePreset(preset.days)}
                  className={`rounded-xl py-2.5 text-sm font-medium transition-all ${
                    !useCustomDate && targetDays === preset.days
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Or end date:</span>
              <input
                type="date"
                value={targetDate}
                min={addDays(today(), 1)}
                onChange={(event) => handleCustomDate(event.target.value)}
                className="flex-1 rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Reading Style</span>
              <span className="font-bold text-primary">Verse-based targets</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Distribution</span>
              <span>Auto-split across {targetDays} days</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
              <span>Goal</span>
              <span>Complete by {formatDate(targetDate)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void onSave({
                name: name.trim() || "My Khatam",
                startJuz,
                targetDate,
              });
            }}
            disabled={isSubmitting}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting ? "Starting..." : "Start Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditModal({ plan, onSave, onClose, onReset }: EditModalProps) {
  const [name, setName] = useState(plan.name);
  const [targetDate, setTargetDate] = useState(plan.targetDate);
  const [confirmReset, setConfirmReset] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    void onSave({
      planId: plan.id,
      name,
      targetDate,
    }).finally(() => setIsSaving(false));
  };

  const handleDelete = () => {
    setIsDeleting(true);
    void onReset({ planId: plan.id }).finally(() => setIsDeleting(false));
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300" onClick={onClose} />
      <div className="relative z-201 w-full max-w-md space-y-6 rounded-4xl border border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div>
          <h2 className="text-2xl font-bold">Edit Plan</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Date</label>
            <input
              type="date"
              value={targetDate}
              min={addDays(today(), 1)}
              onChange={(event) => setTargetDate(event.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isDeleting}
            className="mt-2 h-12 w-full rounded-full bg-primary text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-4 border-t border-border pt-6">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <RotateCcw className="h-4 w-4" />
              Delete Plan
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">This deletes all progress. Are you sure?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="h-10 flex-1 rounded-full bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  type="button"
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

function CalendarHeatmap({ plan }: { plan: KhatamPlan }) {
  const { days } = computeSchedule(plan);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => {
          let bgClass = "bg-secondary/60";

          if (day.isCompleted) {
            bgClass = "bg-primary shadow-sm shadow-primary/20";
          } else if (day.isToday) {
            bgClass = "border-2 border-primary bg-background shadow-sm";
          } else if (day.isPast && !day.isCompleted) {
            bgClass = "border border-destructive/20 bg-destructive/10";
          }

          return (
            <div
              key={day.date}
              title={`Day ${day.dayNumber}: ${formatShortDate(day.date)} — ${day.rangeLabel}${day.isCompleted ? " ✓" : ""}`}
              className={`h-4 w-4 cursor-default rounded-[4px] transition-colors hover:scale-110 ${bgClass}`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px] bg-primary shadow-sm" />
          Done
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px] border border-destructive/20 bg-destructive/10" />
          Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px] bg-secondary/60" />
          Upcoming
        </span>
      </div>
    </div>
  );
}

function CompletionBanner() {
  return (
    <div className="flex items-center gap-6 rounded-4xl border border-primary/20 bg-primary/5 p-8">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
        <Trophy className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">Alhamdulillah! Khatam Complete</h2>
        <p className="mt-1 text-sm text-primary/80">May Allah bless your recitation and accept your effort.</p>
      </div>
    </div>
  );
}

export function TrackerPlanView({ plan, onOpenEdit, onToggleToday, isToggling }: TrackerPlanViewProps) {
  const [tab, setTab] = useState<"overview" | "schedule">("overview");
  const stats = computeStats(plan);
  const { days } = computeSchedule(plan);
  const todayStr = today();
  const isComplete = stats.pct >= 100;
  const todayDone = plan.completedDays.includes(todayStr);
  const focusEntry = stats.primaryReadEntry ?? stats.todayEntry;
  const isShowingUpcomingTarget = Boolean(focusEntry && stats.todayEntry && focusEntry.date !== stats.todayEntry.date);
  const upcoming = days.filter((day) => day.date > todayStr).slice(0, 5);
  const past = days.filter((day) => day.date < todayStr).slice(-5).reverse();

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <TrackerPageHeader plan={plan} onOpenEdit={onOpenEdit} />

      {isComplete ? <CompletionBanner /> : null}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-4xl border border-border bg-card p-6 md:col-span-2 md:p-8">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-primary">Progress</p>
                <h2 className="text-4xl font-bold">
                  Day {stats.currentDay}
                  <span className="text-2xl font-medium text-muted-foreground"> / {stats.totalDays}</span>
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {stats.daysLeft > 0 ? `${stats.daysLeft} days remaining.` : "Target date reached."}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{stats.pct}%</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Completed</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${stats.pct}%` }} />
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="font-medium">{stats.streak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="font-medium text-muted-foreground">{stats.completedCount} exact days done</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {focusEntry ? (
          <div className="flex flex-col rounded-4xl border border-border bg-card p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
                {isShowingUpcomingTarget ? "Next Target" : "Today"}
              </span>
              {isShowingUpcomingTarget ? (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Upcoming
                </span>
              ) : todayDone ? (
                <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Done
                </span>
              ) : (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Pending
                </span>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-bold text-primary">{focusEntry.rangeLabel}</h3>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex-1 rounded-xl border border-border/50 bg-secondary/30 px-3.5 py-2">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Start</p>
                    <p className="text-xs font-semibold">
                      {formatBoundaryLabel(
                        focusEntry.startSurahName,
                        focusEntry.startSurahNumber,
                        focusEntry.startVerse,
                      )}
                    </p>
                  </div>

                  <div className="hidden shrink-0 items-center justify-center text-muted-foreground/50 sm:flex">
                    <ChevronRight className="h-4 w-4" />
                  </div>

                  <div className="flex-1 rounded-xl border border-border/50 bg-secondary/30 px-3.5 py-2">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">End</p>
                    <p className="text-xs font-semibold">
                      {formatBoundaryLabel(focusEntry.endSurahName, focusEntry.endSurahNumber, focusEntry.endVerse)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Est. {Math.max(5, Math.round(focusEntry.versesCount * 1.5))} mins</span>
              </div>
            </div>

            <div className="flex gap-2 pt-6">
              <Link
                href={`/app/read/${focusEntry.readId}?khatam=true&planId=${plan.id}&scheduledDate=${focusEntry.date}&returnTo=/app/tracker`}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <Play className="mr-2 h-4 w-4 fill-white" />
                Continue
              </Link>
              {!isShowingUpcomingTarget ? (
                <button
                  type="button"
                  onClick={() => {
                    void onToggleToday();
                  }}
                  disabled={isToggling}
                  title={todayDone ? "Mark as not done" : "Mark as done"}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                    todayDone
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-transparent bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid items-start gap-8 pt-4 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <button
              type="button"
              onClick={() => setTab("overview")}
              className={`-mb-3.5 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                tab === "overview" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Recent & Upcoming
            </button>
            <button
              type="button"
              onClick={() => setTab("schedule")}
              className={`-mb-3.5 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                tab === "schedule" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Full Journey
            </button>
          </div>

          <div className="space-y-3">
            {tab === "overview" ? (
              <>
                {upcoming.map((item) => (
                  <div
                    key={item.date}
                    className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <span className="font-bold">{item.dayNumber}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.rangeLabel}</p>
                        <p className="mt-0.5 text-[11px] text-primary/80">{item.surahLabel}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground/80">{item.versesCount} verses</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{formatShortDate(item.date)}</p>
                      </div>
                    </div>
                    {item.isCompleted ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : null}
                  </div>
                ))}

                {past.length > 0 ? (
                  <div className="space-y-3 pt-4">
                    <p className="px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Past</p>
                    {past.map((item) => (
                      <div
                        key={item.date}
                        className="flex items-center justify-between rounded-2xl border border-transparent bg-secondary/30 p-4 opacity-80"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-muted-foreground">
                            <span className="text-sm font-medium">{item.dayNumber}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{item.rangeLabel}</p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground/80">{item.surahLabel}</p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground/70">{item.versesCount} verses</p>
                            <p className="mt-0.5 text-xs text-muted-foreground/70">{formatShortDate(item.date)}</p>
                          </div>
                        </div>
                        {item.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-destructive" title="Missed" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}

                {!upcoming.length && !past.length ? (
                  <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                    Your schedule will appear here once the planner has future or past entries around today.
                  </div>
                ) : null}
              </>
            ) : (
              <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
                {days.map((item) => {
                  const status = item.isToday
                    ? {
                        label: "Today",
                        badge: "border border-primary/20 bg-primary/10 text-primary",
                        icon: "bg-primary/10 text-primary",
                      }
                    : item.isCompleted
                      ? {
                          label: "Done",
                          badge: "border border-emerald-200 bg-emerald-50 text-emerald-700",
                          icon: "bg-emerald-50 text-emerald-600",
                        }
                      : item.isPast
                        ? {
                            label: "Missed",
                            badge: "border border-destructive/20 bg-destructive/10 text-destructive",
                            icon: "bg-destructive/10 text-destructive",
                          }
                        : {
                            label: "Upcoming",
                            badge: "border border-border bg-secondary text-muted-foreground",
                            icon: "bg-secondary text-muted-foreground",
                          };

                  return (
                    <div
                      key={item.date}
                      className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status.icon}`}>
                          {item.isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Day {item.dayNumber}
                            {item.isToday ? " · Today" : ""}
                          </p>
                          <p className="mt-0.5 font-semibold">{item.rangeLabel}</p>
                          <p className="mt-0.5 text-[11px] text-primary/80">{item.surahLabel}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground/80">{item.versesCount} verses</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{formatShortDate(item.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                          {item.versesCount} ayat
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.badge}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-4xl border border-border bg-card p-6 md:p-8">
          <h3 className="font-bold">Consistency</h3>
          <p className="pb-2 text-sm text-muted-foreground">
            Visualizing your dedication across the {stats.totalDays} day journey.
          </p>
          <CalendarHeatmap plan={plan} />
        </div>
      </div>
    </div>
  );
}
