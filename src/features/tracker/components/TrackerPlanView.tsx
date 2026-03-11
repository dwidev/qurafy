"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Flame,
  Play,
  Trophy,
} from "lucide-react";
import {
  computeSchedule,
  computeStats,
  formatBoundaryLabel,
  formatDate,
  formatShortDate,
  today,
  type KhatamPlan,
} from "@/features/tracker/components/trackerPageShared";
import { TrackerPageHeader } from "@/features/tracker/components/TrackerPageHeader";

type TrackerPlanViewProps = {
  plan: KhatamPlan;
  onOpenEdit: () => void;
  onToggleToday: () => Promise<void>;
  isToggling: boolean;
};

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
    <div className="animate-in fade-in space-y-8 duration-500">
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
