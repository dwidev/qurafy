"use client";

import { useState, useEffect } from "react";
import {
  Target,
  Plus,
  X,
  PlayCircle,
  PauseCircle,
  Calendar,
  BookOpen,
  Flame,
  Clock,
  TrendingUp,
  ChevronDown,
  Play,
  Check,
  Volume2,
  Mic,
  ArrowRight
} from "lucide-react";

/* ─── Static Surah data ──────────────────────────────────────────────── */
const SURAHS = [
  { n: 1, en: "Al-Fatihah", ar: "ٱلْفَاتِحَة", verses: 7 },
  { n: 78, en: "An-Naba", ar: "ٱلنَّبَإِ", verses: 40 },
  { n: 79, en: "An-Nazi'at", ar: "ٱلنَّٰزِعَٰت", verses: 46 },
  { n: 80, en: "Abasa", ar: "عَبَسَ", verses: 42 },
];

/* ─── Sample verse data for today's target ───────────────────────────── */
const TODAY_VERSES = [
  { n: 1, ar: "عَمَّ يَتَسَآءَلُونَ", tr: "What are they asking one another about?" },
  { n: 2, ar: "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ", tr: "About the great news —" },
  { n: 3, ar: "ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ", tr: "that over which they are in disagreement." },
  { n: 4, ar: "كَلَّا سَيَعْلَمُونَ", tr: "No! They are going to know." },
  { n: 5, ar: "ثُمَّ كَلَّا سَيَعْلَمُونَ", tr: "Then, no! They are going to know." },
];

const UPCOMING = [
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

/* ─── Main page ──────────────────────────────────────────────────────── */
export default function MemorizePage() {
  /* ── State ── */
  const [hasActiveGoal, setHasActiveGoal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [form, setForm] = useState({ title: "", surahIdx: 0, days: 30, reps: 3 });

  /* Active Goal Mock Data */
  const goal = {
    title: "Juz 30 — Amma",
    surah: "An-Naba & beyond",
    totalDays: 30,
    passedDays: form.title ? 1 : 16,
    totalVerses: form.title ? SURAHS[form.surahIdx]?.verses || 110 : 110,
    doneVerses: form.title ? 0 : 62,
  };
  const pct = Math.round((goal.doneVerses / goal.totalVerses) * 100) || 0;
  const remaining = goal.totalDays - goal.passedDays;

  /* ── GUIDED SESSION STATE ── */
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currIdx, setCurrIdx] = useState(0);
  const [currRep, setCurrRep] = useState(1);
  const [phase, setPhase] = useState<"listening" | "reciting">("listening");
  const [sessionDone, setSessionDone] = useState(false);

  // Mock audio playing delay
  useEffect(() => {
    if (sessionOpen && sessionStarted && !sessionDone && phase === "listening") {
      const timer = setTimeout(() => {
        setPhase("reciting");
      }, 3000); // 3 seconds mock listening
      return () => clearTimeout(timer);
    }
  }, [sessionOpen, sessionStarted, sessionDone, phase, currIdx, currRep]);

  function handleNext() {
    if (currRep < (form.reps || 3)) {
      setCurrRep(r => r + 1);
      setPhase("listening");
    } else {
      if (currIdx < TODAY_VERSES.length - 1) {
        setCurrIdx(i => i + 1);
        setCurrRep(1);
        setPhase("listening");
      } else {
        setSessionDone(true);
      }
    }
  }

  function resetSession() {
    setSessionOpen(false);
    setTimeout(() => {
      setSessionStarted(false);
      setSessionDone(false);
      setCurrIdx(0);
      setCurrRep(1);
      setPhase("listening");
    }, 300);
  }

  const v = TODAY_VERSES[currIdx];
  const targetReps = form.reps || 3;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
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
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> New Goal
          </button>
        )}
      </div>

      {!hasActiveGoal ? (
        /* ── WELCOME EMPTY STATE ───────────────────────────── */
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
            <div className="h-32 w-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-lg relative z-10 rotate-3 transition-transform hover:rotate-6">
              <BookOpen className="h-16 w-16 text-primary drop-shadow-md" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Start Your Memorization Journey</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-base md:text-lg">
            Build a lasting habit of memorizing the Quran. Choose a target, set your pace, and we'll guide you step-by-step with interactive daily repetitions.
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
              { icon: Flame, label: "Day Streak", value: "1 days", color: "text-orange-500", bg: "bg-orange-50" },
              { icon: BookOpen, label: "Verses Done", value: `${goal.doneVerses}/${goal.totalVerses}`, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Clock, label: "Days Remaining", value: `${remaining} days`, color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: TrendingUp, label: "Overall Progress", value: `${pct}%`, color: "text-primary", bg: "bg-primary/10" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
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
          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-primary/5 p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 hidden sm:block">
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
                  <p className="text-muted-foreground text-sm mt-0.5">{SURAHS[form.surahIdx]?.en || goal.surah}</p>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700" style={{ width: `${pct}%` }} />
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
            <h2 className="text-xl font-bold">Today's Target</h2>

            {sessionDone ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:p-8 flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-800">Alhamdulillah!</h3>
                  <p className="text-emerald-700/80 text-sm mt-0.5">You have completed today's memorization target.</p>
                </div>
              </div>
            ) : (
              <div
                className="relative group cursor-pointer pt-4"
                onClick={() => setSessionOpen(true)}
              >
                <div className="absolute inset-x-8 top-0 h-full bg-primary/10 rounded-3xl transition-transform duration-300 group-hover:-translate-y-2" />
                <div className="absolute inset-x-4 top-2 h-full bg-primary/20 rounded-3xl transition-transform duration-300 group-hover:-translate-y-1" />

                <div className="relative rounded-3xl border border-border bg-gradient-to-br from-card to-background p-6 md:p-8 shadow-md group-hover:shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-6 z-10 mt-4">
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" /> March 5, 2026
                    </div>
                    <h3 className="text-2xl font-bold">{SURAHS[form.surahIdx]?.en || "An-Naba"}, Verses 1–5</h3>
                    <p className="text-muted-foreground">
                      {TODAY_VERSES.length} verses • {targetReps}× repetitions per verse
                    </p>
                  </div>

                  <button className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-active:scale-95 transition-all">
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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary">
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

      {/* ========================================================= */}
      {/* ── GUIDED MEMORIZATION FULLSCREEN POPUP ───────────────── */}
      {/* ========================================================= */}
      {sessionOpen && hasActiveGoal && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-foreground/5">
            <button onClick={resetSession} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
              <X className="h-6 w-6" />
            </button>
            {sessionStarted && !sessionDone && (
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Memorization Focus</p>
                <div className="flex items-center gap-2 mt-1 justify-center">
                  {TODAY_VERSES.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === currIdx ? "w-6 bg-primary" : i < currIdx ? "w-2 bg-primary/50" : "w-2 bg-secondary"}`} />
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
                  <p className="text-muted-foreground">Today's target: {SURAHS[form.surahIdx]?.en || "An-Naba"}, 1–5.<br />Focus solely on these verses. We will guide you through {targetReps} reps per verse.</p>
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
                    {v.ar}
                  </p>

                  <p className={`text-lg md:text-xl text-muted-foreground transition-all duration-500 ${phase === "reciting" ? "opacity-0" : ""}`}>
                    {v.tr}
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
                        <button onClick={handleNext} className="py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-md transition-all flex items-center justify-center gap-2">
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
                  <p className="text-muted-foreground mt-2">You've successfully completed today's memorization target.</p>
                </div>
                <button
                  onClick={resetSession}
                  className="w-full rounded-2xl bg-foreground px-8 py-4 text-background font-bold hover:bg-foreground/90 transition-all mt-4"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ── Create Goal Modal ── */}
      {showGoalModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowGoalModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-background shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
              <div>
                <h3 className="text-lg font-bold">Create New Goal</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Set up your personalized memorization plan</p>
              </div>
              <button onClick={() => setShowGoalModal(false)} className="rounded-full p-2 hover:bg-muted transition-colors">
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
                    value={form.surahIdx}
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
                  You will memorize <strong className="text-foreground">{SURAHS[form.surahIdx]?.en}</strong> over <strong className="text-foreground">{form.days} days</strong>. This requires learning approximately <strong className="text-foreground">{Math.ceil((SURAHS[form.surahIdx]?.verses || 0) / form.days)} verses</strong> per day, repeating each verse <strong className="text-foreground">{form.reps} times</strong> during training.
                </p>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 flex gap-3 bg-muted/20">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowGoalModal(false);
                  setHasActiveGoal(true);
                }}
                disabled={!form.title}
                className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Start Memorizing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
