"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight, Play, CheckCircle2,
  Edit2, Clock, Plus, X, Trophy, Flame,
  RotateCcw, BookOpen
} from "lucide-react";

// ─── Quran data ───────────────────────────────────────────────────────────────
const JUZ_DATA: { juz: number; start: string; end: string; pages: number }[] = [
  { juz: 1, start: "Al-Fatihah 1:1", end: "Al-Baqarah 2:141", pages: 20 },
  { juz: 2, start: "Al-Baqarah 2:142", end: "Al-Baqarah 2:252", pages: 20 },
  { juz: 3, start: "Al-Baqarah 2:253", end: "Ali 'Imran 3:92", pages: 20 },
  { juz: 4, start: "Ali 'Imran 3:93", end: "An-Nisa 4:23", pages: 20 },
  { juz: 5, start: "An-Nisa 4:24", end: "An-Nisa 4:147", pages: 20 },
  { juz: 6, start: "An-Nisa 4:148", end: "Al-Ma'idah 5:81", pages: 20 },
  { juz: 7, start: "Al-Ma'idah 5:82", end: "Al-An'am 6:110", pages: 20 },
  { juz: 8, start: "Al-An'am 6:111", end: "Al-A'raf 7:87", pages: 20 },
  { juz: 9, start: "Al-A'raf 7:88", end: "Al-Anfal 8:40", pages: 20 },
  { juz: 10, start: "Al-Anfal 8:41", end: "At-Tawbah 9:92", pages: 20 },
  { juz: 11, start: "At-Tawbah 9:93", end: "Hud 11:5", pages: 20 },
  { juz: 12, start: "Hud 11:6", end: "Yusuf 12:52", pages: 20 },
  { juz: 13, start: "Yusuf 12:53", end: "Ibrahim 14:52", pages: 20 },
  { juz: 14, start: "Al-Hijr 15:1", end: "An-Nahl 16:128", pages: 20 },
  { juz: 15, start: "Al-Isra 17:1", end: "Al-Kahf 18:74", pages: 20 },
  { juz: 16, start: "Al-Kahf 18:75", end: "Ta-Ha 20:135", pages: 20 },
  { juz: 17, start: "Al-Anbya 21:1", end: "Al-Hajj 22:78", pages: 20 },
  { juz: 18, start: "Al-Mu'minun 23:1", end: "Al-Furqan 25:20", pages: 20 },
  { juz: 19, start: "Al-Furqan 25:21", end: "An-Naml 27:55", pages: 20 },
  { juz: 20, start: "An-Naml 27:56", end: "Al-Ankabut 29:45", pages: 20 },
  { juz: 21, start: "Al-Ankabut 29:46", end: "Al-Ahzab 33:30", pages: 20 },
  { juz: 22, start: "Al-Ahzab 33:31", end: "Ya-Sin 36:27", pages: 20 },
  { juz: 23, start: "Ya-Sin 36:28", end: "Az-Zumar 39:31", pages: 20 },
  { juz: 24, start: "Az-Zumar 39:32", end: "Fussilat 41:46", pages: 20 },
  { juz: 25, start: "Fussilat 41:47", end: "Al-Jathiyah 45:37", pages: 20 },
  { juz: 26, start: "Al-Ahqaf 46:1", end: "Az-Zariyat 51:30", pages: 20 },
  { juz: 27, start: "Az-Zariyat 51:31", end: "Al-Hadid 57:29", pages: 20 },
  { juz: 28, start: "Al-Mujadila 58:1", end: "At-Tahrim 66:12", pages: 20 },
  { juz: 29, start: "Al-Mulk 67:1", end: "Al-Mursalat 77:50", pages: 20 },
  { juz: 30, start: "An-Naba 78:1", end: "An-Nas 114:6", pages: 20 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface KhatamPlan {
  name: string;
  startJuz: number;
  startDate: string;
  targetDate: string;
  completedDays: string[];
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

function today() {
  return toDateStr(new Date());
}

function daysBetween(a: string, b: string) {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000
  );
}

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
}

function computeSchedule(plan: KhatamPlan) {
  const totalDays = daysBetween(plan.startDate, plan.targetDate) + 1;
  const juzLeft = 30 - (plan.startJuz - 1);
  const juzPerDay = juzLeft / totalDays;

  const days: {
    day: number;
    date: string;
    juzFrom: number;
    juzTo: number;
    label: string;
    isCompleted: boolean;
    isToday: boolean;
    isPast: boolean;
  }[] = [];

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(plan.startDate, i);
    const juzStart = plan.startJuz + i * juzPerDay;
    const juzEnd = plan.startJuz + (i + 1) * juzPerDay;
    const juzFromInt = Math.floor(juzStart) + 1;
    const juzToInt = Math.min(30, Math.ceil(juzEnd));
    const isCompleted = plan.completedDays.includes(date);
    const isToday = date === today();
    const isPast = date < today();
    const label =
      juzFromInt === juzToInt
        ? `Juz ${juzFromInt}`
        : `Juz ${juzFromInt} & ${juzToInt}`;
    days.push({ day: i + 1, date, juzFrom: juzFromInt, juzTo: juzToInt, label, isCompleted, isToday, isPast });
  }
  return { days, totalDays, juzPerDay };
}

function computeStats(plan: KhatamPlan) {
  const { days, totalDays } = computeSchedule(plan);
  const todayStr = today();
  const currentDayIdx = days.findIndex((d) => d.date === todayStr);
  const currentDay = currentDayIdx >= 0 ? currentDayIdx + 1 : totalDays;
  const completedCount = plan.completedDays.length;
  const pct = Math.round((completedCount / totalDays) * 100);
  const todayEntry = days.find((d) => d.date === todayStr);
  const daysLeft = daysBetween(todayStr, plan.targetDate);
  // Streak
  let streak = 0;
  let checkDate = todayStr;
  while (plan.completedDays.includes(checkDate)) {
    streak++;
    checkDate = addDays(checkDate, -1);
  }
  return { currentDay, totalDays, completedCount, pct, todayEntry, daysLeft, streak };
}

// ─── Welcome Page ─────────────────────────────────────────────────────────────
function WelcomeState({ onOpenSetup }: { onOpenSetup: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="h-32 w-32 bg-linear-to-br from-primary/20 to-primary/5 rounded-4xl flex items-center justify-center border border-primary/20 shadow-lg relative z-10 rotate-3 transition-transform hover:rotate-6">
          <BookOpen className="h-16 w-16 text-primary drop-shadow-md" />
        </div>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Start Your Khatam Journey</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-10 text-base md:text-lg">
        Plan your Quran reading and stay on track with daily targets. Set your goal and let Qurafy guide your progress.
      </p>
      <button
        onClick={onOpenSetup}
        className="rounded-full bg-primary px-8 py-4 text-primary-foreground font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg flex items-center gap-2"
      >
        <Plus className="h-5 w-5" /> Create Khatam Plan
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left max-w-3xl">
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
          <h3 className="font-semibold text-foreground">Set a Target</h3>
          <p className="text-sm text-muted-foreground">Pick a start Juz and choose how many days you want to complete the Khatam in.</p>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
          <h3 className="font-semibold text-foreground">Daily Schedule</h3>
          <p className="text-sm text-muted-foreground">We calculate exactly which Juz and pages you need to read every single day.</p>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
          <h3 className="font-semibold text-foreground">Track Progress</h3>
          <p className="text-sm text-muted-foreground">Mark days as done, build your streak, and watch your Khatam heatmap light up.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Setup Modal ──────────────────────────────────────────────────────────────
function SetupModal({ onSave, onClose }: { onSave: (plan: KhatamPlan) => void; onClose: () => void }) {
  const [name, setName] = useState("Ramadan Challenge");
  const [startJuz, setStartJuz] = useState(1);
  const [targetDays, setTargetDays] = useState(30);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 29);
    return toDateStr(d);
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
    const d = new Date();
    d.setDate(d.getDate() + days - 1);
    setTargetDate(toDateStr(d));
    setUseCustomDate(false);
  };

  const handleCustomDate = (val: string) => {
    setTargetDate(val);
    setUseCustomDate(true);
    setTargetDays(daysBetween(today(), val) + 1);
  };

  const juzLeft = 30 - (startJuz - 1);
  const pagesPerDay = ((juzLeft * 20) / targetDays).toFixed(1);

  const handleSave = () => {
    const plan: KhatamPlan = {
      name: name.trim() || "My Khatam",
      startJuz,
      startDate: today(),
      targetDate,
      completedDays: [],
      createdAt: today(),
    };
    localStorage.setItem("khatam_plan", JSON.stringify(plan));
    onSave(plan);
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-4xl border border-border bg-card p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">

        <button onClick={onClose} className="absolute top-6 right-6 h-8 w-8 flex items-center justify-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold">New Plan</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your Khatam schedule.</p>
        </div>

        <div className="space-y-6">
          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-base outline-none focus:border-primary transition-colors"
              placeholder="e.g. Daily Check-in"
            />
          </div>

          {/* Start from Juz */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start from Juz</label>
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 15, 20, 25, 29].map((j) => (
                <button
                  key={j}
                  onClick={() => setStartJuz(j)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${startJuz === j
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                >
                  {j}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Or custom:</span>
              <input
                type="number"
                min={1} max={30}
                value={startJuz}
                onChange={(e) => setStartJuz(Math.min(30, Math.max(1, Number(e.target.value))))}
                className="w-16 rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-center outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Target Duration */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((p) => (
                <button
                  key={p.days}
                  onClick={() => handlePreset(p.days)}
                  className={`rounded-xl py-2.5 text-sm font-medium transition-all ${!useCustomDate && targetDays === p.days
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Or end date:</span>
              <input
                type="date"
                value={targetDate}
                min={addDays(today(), 1)}
                onChange={(e) => handleCustomDate(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Clean Summary */}
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Daily Target</span>
              <span className="text-primary font-bold">{pagesPerDay} pages</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Goal</span>
              <span>Complete by {formatDate(targetDate)}</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium text-base shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            Start Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ plan, onSave, onClose, onReset }: {
  plan: KhatamPlan;
  onSave: (p: KhatamPlan) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const [name, setName] = useState(plan.name);
  const [targetDate, setTargetDate] = useState(plan.targetDate);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = () => {
    const updated: KhatamPlan = { ...plan, name, targetDate };
    localStorage.setItem("khatam_plan", JSON.stringify(updated));
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative z-201 w-full max-w-md rounded-4xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">

        <button onClick={onClose} className="absolute top-6 right-6 h-8 w-8 flex items-center justify-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
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
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Date</label>
            <input
              type="date"
              value={targetDate}
              min={addDays(today(), 1)}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full h-12 mt-2 rounded-full bg-primary text-primary-foreground font-medium text-base shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Save Changes
          </button>
        </div>

        <div className="border-t border-border pt-6 mt-4">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full h-10 rounded-full text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Delete Plan
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">This deletes all progress. Are you sure?</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmReset(false)} className="flex-1 h-10 rounded-full bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
                <button onClick={onReset} className="flex-1 h-10 rounded-full bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">Confirm Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Calendar Heatmap ─────────────────────────────────────────────────────────
function CalendarHeatmap({ plan }: { plan: KhatamPlan }) {
  const { days } = computeSchedule(plan);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex gap-1.5 flex-wrap">
        {days.map((d) => {
          let bg = "bg-secondary/60";
          if (d.isCompleted) bg = "bg-primary shadow-sm shadow-primary/20";
          else if (d.isToday) bg = "bg-background border-2 border-primary shadow-sm";
          else if (d.isPast && !d.isCompleted) bg = "bg-destructive/10 border border-destructive/20";

          return (
            <div
              key={d.date}
              title={`Day ${d.day}: ${formatShortDate(d.date)} — ${d.label}${d.isCompleted ? " ✓" : ""}`}
              className={`h-4 w-4 rounded-[4px] ${bg} transition-colors cursor-default hover:scale-110`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-primary shadow-sm" /> Done</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-destructive/10 border border-destructive/20" /> Missed</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-secondary/60" /> Upcoming</span>
      </div>
    </div>
  );
}

// ─── Main Tracker Page ────────────────────────────────────────────────────────
export default function TrackerPage() {
  const [plan, setPlan] = useState<KhatamPlan | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem("khatam_plan");
    if (!saved) return null;
    try {
      return JSON.parse(saved) as KhatamPlan;
    } catch {
      return null;
    }
  });
  const [showSetup, setShowSetup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [tab, setTab] = useState<"overview" | "schedule">("overview");

  const handlePlanSave = useCallback((p: KhatamPlan) => {
    setPlan(p);
    setShowSetup(false);
    setShowEdit(false);
  }, []);

  const handleReset = useCallback(() => {
    localStorage.removeItem("khatam_plan");
    setPlan(null);
    setShowEdit(false);
  }, []);

  const toggleToday = useCallback(() => {
    if (!plan) return;
    const t = today();
    const already = plan.completedDays.includes(t);
    const updated: KhatamPlan = {
      ...plan,
      completedDays: already
        ? plan.completedDays.filter((d) => d !== t)
        : [...plan.completedDays, t],
    };
    localStorage.setItem("khatam_plan", JSON.stringify(updated));
    setPlan(updated);
  }, [plan]);

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-24">
      {/* ── Page Header (Always visible) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </span>
            Khatam Planner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {plan ? plan.name : "Track your Quran completion progress"}
          </p>
        </div>

        {plan && (
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Edit2 className="h-4 w-4" /> Plan Settings
          </button>
        )}
      </div>

      {/* If no plan, show welcome state. If showSetup is true, modal floats above it. */}
      {!plan ? (
        <WelcomeState onOpenSetup={() => setShowSetup(true)} />
      ) : (
        <div className="animate-in fade-in duration-500 space-y-8">
          {(() => {
            const stats = computeStats(plan);
            const { days } = computeSchedule(plan);
            const isComplete = stats.pct >= 100;
            const todayDone = plan.completedDays.includes(today());
            const upcoming = days.filter((d) => d.date > today()).slice(0, 5);
            const past = days.filter((d) => d.date < today()).slice(-5).reverse();

            return (
              <>
                {/* ── Completion Banner */}
                {isComplete && (
                  <div className="rounded-4xl bg-primary/5 dark:bg-primary/10 border border-primary/20 p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex shrink-0 items-center justify-center text-primary">
                      <Trophy className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Alhamdulillah! Khatam Complete 🎉</h2>
                      <p className="text-primary/80 mt-1">May Allah bless your recitation and accept your effort.</p>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                  {/* ── Clean Hero / Stats */}
                  <div className="md:col-span-2 rounded-4xl border border-border bg-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1.5">Progress</p>
                          <h2 className="text-4xl font-bold">
                            Day {stats.currentDay} <span className="text-2xl text-muted-foreground font-medium">/ {stats.totalDays}</span>
                          </h2>
                          <p className="text-muted-foreground mt-2">
                            {stats.daysLeft > 0 ? `${stats.daysLeft} days remaining.` : "Target date reached."}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-primary">{stats.pct}%</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Completed</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${stats.pct}%` }} />
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

                  {/* ── Today's Focus Card */}
                  {stats.todayEntry && (
                    <div className="rounded-4xl border border-border bg-card p-6 md:p-8 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Today</span>
                        {todayDone ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                            <CheckCircle2 className="h-3 w-3" /> Done
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-primary mb-3">{stats.todayEntry.label}</h3>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex-1 rounded-xl bg-secondary/30 px-3.5 py-2 border border-border/50">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Start</p>
                              <p className="text-xs font-semibold">{JUZ_DATA[stats.todayEntry.juzFrom - 1]?.start.split(" ").slice(0, -1).join(" ")}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{JUZ_DATA[stats.todayEntry.juzFrom - 1]?.start.split(" ").pop()}</p>
                            </div>

                            <div className="hidden sm:flex shrink-0 items-center justify-center text-muted-foreground/50">
                              <ChevronRight className="h-4 w-4" />
                            </div>

                            <div className="flex-1 rounded-xl bg-secondary/30 px-3.5 py-2 border border-border/50">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">End</p>
                              <p className="text-xs font-semibold">{JUZ_DATA[Math.min(30, stats.todayEntry.juzTo) - 1]?.end.split(" ").slice(0, -1).join(" ")}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{JUZ_DATA[Math.min(30, stats.todayEntry.juzTo) - 1]?.end.split(" ").pop()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Est. {Math.round((stats.todayEntry.juzTo - stats.todayEntry.juzFrom + 1) * 45)} mins</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-6">
                        <Link
                          href={`/app/read/juz-${stats.todayEntry.juzFrom}?khatam=true`}
                          className="flex-1 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
                        >
                          <Play className="mr-2 h-4 w-4 fill-white" /> Read
                        </Link>
                        <button
                          onClick={toggleToday}
                          title={todayDone ? "Mark as not done" : "Mark as done"}
                          className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${todayDone
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-secondary border-transparent hover:bg-muted text-muted-foreground"
                            }`}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Schedule Section */}
                <div className="grid md:grid-cols-2 gap-8 items-start pt-4">

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border pb-3">
                      <button
                        onClick={() => setTab("overview")}
                        className={`text-sm font-semibold pb-3 -mb-3.5 border-b-2 transition-colors ${tab === "overview" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        Recent & Upcoming
                      </button>
                      <button
                        onClick={() => setTab("schedule")}
                        className={`text-sm font-semibold pb-3 -mb-3.5 border-b-2 transition-colors ${tab === "schedule" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        Full Journey
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tab === "overview" ? (
                        <>
                          {upcoming.map((item) => (
                            <div key={item.date} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors group">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                  <span className="font-bold">{item.day}</span>
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{item.label}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{formatShortDate(item.date)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {past.length > 0 && (
                            <div className="pt-4 space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">Past</p>
                              {past.map((item) => (
                                <div key={item.date} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 opacity-80 border border-transparent">
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-background text-muted-foreground">
                                      <span className="font-medium text-sm">{item.day}</span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm text-muted-foreground">{item.label}</p>
                                      <p className="text-xs text-muted-foreground/70 mt-0.5">{formatShortDate(item.date)}</p>
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
                          )}
                        </>
                      ) : (
                        <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
                          {days.map((item) => (
                            <div key={item.date} className={`flex items-center justify-between p-3 rounded-xl border ${item.isToday ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-transparent bg-secondary/50 hover:bg-secondary"
                              }`}>
                              <div className="flex items-center gap-4">
                                <span className={`w-8 text-center text-xs font-bold ${item.isToday ? "text-primary" : "text-muted-foreground"}`}>{item.day}</span>
                                <div>
                                  <p className="font-medium text-sm">{item.label}</p>
                                  <p className="text-[11px] text-muted-foreground">{formatShortDate(item.date)}</p>
                                </div>
                              </div>
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background border border-border">
                                {item.isToday ? "Today" : item.isCompleted ? "✓ Done" : item.isPast ? "Missed" : "Upcoming"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Heatmap side */}
                  <div className="rounded-4xl border border-border bg-card p-6 md:p-8 space-y-4">
                    <h3 className="font-bold">Consistency</h3>
                    <p className="text-sm text-muted-foreground pb-2">Visualizing your dedication across the {stats.totalDays} day journey.</p>
                    <CalendarHeatmap plan={plan} />
                  </div>

                </div>

              </>
            );
          })()}
        </div>
      )}

      {/* Modals outside the main flow */}
      {showSetup && <SetupModal onSave={handlePlanSave} onClose={() => setShowSetup(false)} />}
      {showEdit && plan && <EditModal plan={plan} onSave={handlePlanSave} onClose={() => setShowEdit(false)} onReset={handleReset} />}
    </div>
  );
}
