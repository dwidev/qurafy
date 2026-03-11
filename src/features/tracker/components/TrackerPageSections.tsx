"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit2,
  Flame,
  Play,
  Plus,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import type { KhatamActivePlan } from "@/features/tracker/types";

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
    primaryReadEntry,
    daysLeft: daysBetween(todayStr, plan.targetDate),
    streak: plan.currentStreak,
  };
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "done" | "pending" | "upcoming" | "missed";
}) {
  const toneClass = {
    done: "border-primary/20 bg-primary/10 text-primary",
    pending: "border-border bg-secondary text-muted-foreground",
    upcoming: "border-border bg-secondary text-muted-foreground",
    missed: "border-destructive/20 bg-destructive/10 text-destructive",
  }[tone];

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${toneClass}`}>
      {label}
    </span>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-4xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-5">
        <h3 className="text-lg font-bold">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
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

function CompletionBanner() {
  return (
    <div className="flex items-center gap-6 rounded-4xl border border-primary/20 bg-primary/5 p-8">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
        <Trophy className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">Alhamdulillah! Khatam complete</h2>
        <p className="mt-1 text-sm text-primary/80">May Allah bless your recitation and accept your effort.</p>
      </div>
    </div>
  );
}

function ProgressHero({
  plan,
  pct,
  currentDay,
  totalDays,
  daysLeft,
  streak,
  completedCount,
}: {
  plan: KhatamPlan;
  pct: number;
  currentDay: number;
  totalDays: number;
  daysLeft: number;
  streak: number;
  completedCount: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative z-10 space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-primary">Progress</p>
            <h2 className="text-4xl font-bold">
              Day {currentDay}
              <span className="text-2xl font-medium text-muted-foreground"> / {totalDays}</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {daysLeft > 0 ? `${daysLeft} days remaining until ${formatDate(plan.targetDate)}.` : "Target date reached."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{pct}%</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Completed</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="font-medium">{streak} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="font-medium text-muted-foreground">{completedCount} days done</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FocusCard({
  plan,
  focusEntry,
  todayEntry,
  todayDone,
  onToggleToday,
  isToggling,
}: {
  plan: KhatamPlan;
  focusEntry: KhatamPlan["dailyTargets"][number];
  todayEntry: KhatamPlan["dailyTargets"][number] | undefined;
  todayDone: boolean;
  onToggleToday: () => Promise<void>;
  isToggling: boolean;
}) {
  const isTodayEntry = todayEntry?.date === focusEntry.date;
  const isUpcoming = !isTodayEntry;
  const readHref = `/app/read/${focusEntry.readId}?khatam=true&planId=${plan.id}&scheduledDate=${focusEntry.date}&returnTo=/app/tracker`;

  return (
    <section className="rounded-4xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
          {isUpcoming ? "Next Target" : "Today"}
        </span>
        {todayDone && isTodayEntry ? (
          <StatusBadge label="Done" tone="done" />
        ) : isUpcoming ? (
          <StatusBadge label="Upcoming" tone="upcoming" />
        ) : (
          <StatusBadge label="Pending" tone="pending" />
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-xl font-bold text-primary">{focusEntry.rangeLabel}</h3>
          <div className="space-y-2">
            <div className="rounded-xl border border-border/50 bg-secondary/30 px-3.5 py-3">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Start</p>
              <p className="text-sm font-semibold">
                {formatBoundaryLabel(focusEntry.startSurahName, focusEntry.startSurahNumber, focusEntry.startVerse)}
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-secondary/30 px-3.5 py-3">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Finish</p>
              <p className="text-sm font-semibold">
                {formatBoundaryLabel(focusEntry.endSurahName, focusEntry.endSurahNumber, focusEntry.endVerse)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Verses</p>
            <p className="mt-2 text-2xl font-bold">{focusEntry.versesCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Scheduled</p>
            <p className="mt-2 text-sm font-bold">{formatDate(focusEntry.date)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={readHref}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Play className="h-4 w-4" />
            Open Reading Target
          </Link>
          {isTodayEntry && !todayDone ? (
            <button
              type="button"
              onClick={() => {
                void onToggleToday();
              }}
              disabled={isToggling}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background text-sm font-bold transition-all hover:bg-muted disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isToggling ? "Saving..." : "Mark Today Done"}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TimelineList({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: KhatamPlan["dailyTargets"];
  emptyMessage: string;
}) {
  return (
    <SectionCard title={title}>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => {
            const tone = item.isCompleted ? "done" : item.isPast ? "missed" : item.isToday ? "pending" : "upcoming";

            return (
              <div
                key={item.date}
                className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-4"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-foreground">
                    {item.dayNumber}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{item.rangeLabel}</p>
                    <p className="mt-0.5 text-xs text-primary/80">{item.surahLabel}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.versesCount} verses • {formatShortDate(item.date)}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  label={item.isCompleted ? "Done" : item.isPast ? "Missed" : item.isToday ? "Today" : "Upcoming"}
                  tone={tone}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </SectionCard>
  );
}

function CalendarHeatmap({ plan }: { plan: KhatamPlan }) {
  const { days } = computeSchedule(plan);

  return (
    <div className="space-y-4">
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
              title={`Day ${day.dayNumber}: ${formatShortDate(day.date)} — ${day.rangeLabel}`}
              className={`h-4 w-4 rounded-[4px] ${bgClass} transition-transform hover:scale-110`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
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

function ConsistencyCard({ plan }: { plan: KhatamPlan }) {
  const stats = computeStats(plan);

  return (
    <SectionCard
      title="Consistency"
      description={`Visualizing your dedication across the ${stats.totalDays} day journey.`}
    >
      <CalendarHeatmap plan={plan} />
    </SectionCard>
  );
}

function ScheduleTabs({
  activeTab,
  onChange,
}: {
  activeTab: "overview" | "schedule";
  onChange: (tab: "overview" | "schedule") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-secondary/50 p-1">
      {[
        { value: "overview", label: "Overview" },
        { value: "schedule", label: "Full Schedule" },
      ].map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value as "overview" | "schedule")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === tab.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function FullScheduleList({ plan }: { plan: KhatamPlan }) {
  const { days } = computeSchedule(plan);

  return (
    <SectionCard title="Daily Schedule" description="Every reading target, sorted by date.">
      <div className="max-h-[640px] space-y-3 overflow-y-auto pr-2">
        {days.map((item) => {
          const tone = item.isToday ? "pending" : item.isCompleted ? "done" : item.isPast ? "missed" : "upcoming";

          return (
            <div
              key={item.date}
              className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-5 py-4 transition-all hover:border-primary/30"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                  {item.isCompleted ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Calendar className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Day {item.dayNumber}
                    {item.isToday ? " · Today" : ""}
                  </p>
                  <p className="mt-0.5 font-semibold">{item.rangeLabel}</p>
                  <p className="mt-0.5 text-[11px] text-primary/80">{item.surahLabel}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                    {item.versesCount} verses • {formatShortDate(item.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  {item.versesCount} ayat
                </span>
                <StatusBadge
                  label={item.isToday ? "Today" : item.isCompleted ? "Done" : item.isPast ? "Missed" : "Upcoming"}
                  tone={tone}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
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
        <div className="h-40 w-full rounded-2xl bg-secondary" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 rounded-2xl bg-secondary" />
          <div className="h-48 rounded-2xl bg-secondary" />
        </div>
      </div>
    </div>
  );
}

export function TrackerPageHeader({ plan, onOpenEdit }: TrackerPageHeaderProps) {
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
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90"
        >
          <Edit2 className="h-4 w-4" />
          Plan Settings
        </button>
      ) : null}
    </div>
  );
}

export function WelcomeState({ onOpenSetup }: { onOpenSetup: () => void }) {
  return (
    <div className="animate-in fade-in zoom-in-95 py-16 text-center duration-500 md:py-24">
      <div className="relative mb-8 flex justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-4xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
      </div>
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Start your khatam journey</h2>
      <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground md:text-lg">
        Plan your Quran reading, split the targets automatically, and stay consistent every day.
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
        <WelcomeFeature number="1" title="Set a target" description="Choose a starting juz and target finish date." />
        <WelcomeFeature number="2" title="Follow the schedule" description="Qurafy splits the remaining reading into exact daily ranges." />
        <WelcomeFeature number="3" title="Stay accountable" description="Mark days done and watch your consistency improve." />
      </div>
    </div>
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
          <h2 className="text-2xl font-bold">New plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">Configure your khatam schedule.</p>
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
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start from Juz</label>
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
            className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
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
    void onSave({ planId: plan.id, name, targetDate }).finally(() => setIsSaving(false));
  };

  const handleDelete = () => {
    setIsDeleting(true);
    void onReset({ planId: plan.id }).finally(() => setIsDeleting(false));
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300" onClick={onClose} />
      <div className="relative z-201 w-full max-w-md rounded-4xl border border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Edit plan</h2>
          <p className="text-sm text-muted-foreground">Update the plan name or finish date.</p>
        </div>

        <div className="mt-6 space-y-4">
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
            className="mt-2 h-12 w-full rounded-full bg-primary text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
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

export function TrackerPlanView({ plan, onOpenEdit, onToggleToday, isToggling }: TrackerPlanViewProps) {
  const [tab, setTab] = useState<"overview" | "schedule">("overview");
  const stats = computeStats(plan);
  const { days } = computeSchedule(plan);
  const isComplete = stats.pct >= 100;
  const todayDone = plan.completedDays.includes(today());
  const focusEntry = stats.primaryReadEntry ?? stats.todayEntry;
  const upcoming = days.filter((day) => day.date > today()).slice(0, 5);
  const past = days.filter((day) => day.date < today()).slice(-5).reverse();

  if (!focusEntry) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <TrackerPageHeader plan={plan} onOpenEdit={onOpenEdit} />

      {isComplete ? <CompletionBanner /> : null}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProgressHero
            plan={plan}
            pct={stats.pct}
            currentDay={stats.currentDay}
            totalDays={stats.totalDays}
            daysLeft={stats.daysLeft}
            streak={stats.streak}
            completedCount={stats.completedCount}
          />
        </div>
        <FocusCard
          plan={plan}
          focusEntry={focusEntry}
          todayEntry={stats.todayEntry}
          todayDone={todayDone}
          onToggleToday={onToggleToday}
          isToggling={isToggling}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Plan Breakdown</h2>
          <p className="text-sm text-muted-foreground">Switch between a quick dashboard overview and the full schedule.</p>
        </div>
        <ScheduleTabs activeTab={tab} onChange={setTab} />
      </div>

      {tab === "overview" ? (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_1.15fr_0.8fr]">
          <TimelineList title="Upcoming Targets" items={upcoming} emptyMessage="No upcoming targets left." />
          <TimelineList title="Recent History" items={past} emptyMessage="No completed or missed days yet." />
          <ConsistencyCard plan={plan} />
        </div>
      ) : (
        <FullScheduleList plan={plan} />
      )}
    </div>
  );
}
