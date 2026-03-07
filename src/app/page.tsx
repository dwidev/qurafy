import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Target,
  Globe,
  Headphones,
  Bookmark,
  BarChart2,
  Play,
  ChevronRight,
  Flame,
  TrendingUp,
  Clock,
  Heart,
  Sparkles,
  Trophy,
} from "lucide-react";
import ScrollAnimator from "@/components/ScrollAnimator";
import { ThemeToggle } from "@/components/theme-toggle";
import { StarryBackground } from "@/components/StarryBackground";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">

      {/* ── Background stars & moons (dark mode only) ── */}
      <StarryBackground />

      {/* ── IntersectionObserver (client) drives all .reveal elements ── */}
      <ScrollAnimator />

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <header className="sticky top-4 z-50 flex justify-center px-4">
        <div className="w-full max-w-5xl flex items-center justify-between rounded-2xl border border-border bg-card/80 backdrop-blur-md px-5 py-3 shadow-sm">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Qurafy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#preview" className="hover:text-foreground transition-colors">Preview</Link>
            <Link href="/app/read" className="hover:text-foreground transition-colors">Quran</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-medium border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors">
              Login
            </Link>
            <Link href="/app" className="flex items-center gap-1.5 text-sm font-semibold bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 transition-colors">
              Register <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Fixed Theme Toggle (bottom-right) ── */}
      <ThemeToggle showLabel={true} className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-border bg-card/80 backdrop-blur-md text-muted-foreground hover:bg-muted hover:text-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all" />

      <main className="flex-1">

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center px-4 pt-20 pb-8 md:pt-28 md:pb-12">

          {/* pill badge */}
          <div className="reveal reveal-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Free to use — no ads, no distractions
          </div>

          {/* headline */}
          <h1 className="reveal reveal-up reveal-d1 text-5xl md:text-7xl font-bold tracking-tighter max-w-3xl leading-tight text-foreground">
            Read. Memorize.<br />
            <span className="text-primary">Complete the Quran.</span>
          </h1>

          {/* subtext */}
          <p className="reveal reveal-up reveal-d2 mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Qurafy helps you build daily reading and memorization habits with automated planners, beautiful Uthmani script, and seamless progress tracking.
          </p>

          {/* CTAs */}
          <div className="reveal reveal-up reveal-d3 flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/app" className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-foreground text-background px-8 text-sm font-semibold hover:bg-foreground/90 transition-colors shadow">
              Get Started — it&apos;s free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#pricing" className="inline-flex items-center justify-center gap-2 h-12 rounded-full border border-input bg-card px-8 text-sm font-medium hover:bg-muted transition-colors shadow-sm">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" /> Support our Mission
            </Link>
          </div>

          {/* social proof stats */}
          <div className="reveal reveal-up reveal-d4 flex items-center gap-6 mt-8 text-sm text-muted-foreground">
            {[["1k+", "Users Joined"], ["500+", "Khatams Completed"], ["10K+", "Verses Read"]].map(([n, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span><strong className="text-foreground">{n}</strong> {l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── HERO MOCKUP ─────────────────────────────── */}
        <section id="preview" className="flex justify-center px-4 pb-24">
          <div className="reveal reveal-scale relative w-full max-w-5xl">
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-primary/10 via-primary/5 to-transparent blur-3xl -z-10 scale-110" />
            <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden pointer-events-none select-none">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/50">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 h-6 rounded-md bg-secondary flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">qurafy.io/app</span>
                </div>
              </div>
              <div className="p-6 md:p-8 bg-background flex flex-col gap-8 md:gap-10">
                {/* ── Quick Stats Mock ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: Flame, label: "Current Streak", value: "16 Days", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
                    { icon: Clock, label: "Time Read", value: "14h 20m", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
                    { icon: BookOpen, label: "Verses Read", value: "1,240", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    { icon: TrendingUp, label: "Weekly Goal", value: "80%", color: "text-primary", bg: "bg-primary/10" },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm">
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

                {/* ── Active Goals & Progress Mock ── */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold px-1">Your Progress</h2>
                  <div className="grid md:grid-cols-2 gap-4">

                    {/* Memorization Progress */}
                    <div className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 shadow-inner">
                            <Target className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">Memorization</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span> Active Target
                            </p>
                          </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-600">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm font-medium text-foreground">Surah An-Naba</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Verses 1-15 memorized</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-emerald-600">38%</p>
                          </div>
                        </div>

                        <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full w-[38%] relative">
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                          <span className="text-muted-foreground">Daily Goal: 5 Verses</span>
                          <span className="font-medium text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10">On Track</span>
                        </div>
                      </div>
                    </div>

                    {/* Khatam Tracker */}
                    <div className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 shadow-inner">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">Khatam Progress</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <span className="flex h-2 w-2 rounded-full bg-orange-500"></span> Ramadan Plan
                            </p>
                          </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50/50 dark:bg-orange-500/5 text-orange-500">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm font-medium text-foreground">Juz 8</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Day 8 of 30</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-orange-500">26%</p>
                          </div>
                        </div>

                        <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full w-[26%] relative">
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                          <span className="text-muted-foreground">Today's Target: 20 Pages</span>
                          <span className="font-medium text-orange-500 px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10">12 Pages Left</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE 1: Reader ──────────────────────── */}
        <section id="features" className="relative py-20 md:py-28 px-4 overflow-hidden bg-gradient-to-br from-blue-950/40 via-card to-card dark:from-blue-950/30 dark:via-background dark:to-background">
          {/* Decorative floating orbs */}
          <div className="absolute top-10 -left-20 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-56 h-56 bg-indigo-500/8 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 dark:bg-blue-400/3 rounded-full blur-3xl pointer-events-none" />
          <div className="container relative z-10 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* text side — slides in from left */}
              <div className="reveal reveal-left space-y-6">
                <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Beautiful Reader
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                  Read with clarity,<br />in any language.
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Authentic Uthmani script beautifully rendered. Toggle translations in your language, play audio for any verse, and bookmark your last position — across all your devices.
                </p>
                <ul className="space-y-3">
                  {[
                    [Globe, "Multi-language translations"],
                    [Headphones, "Verse-by-verse audio playback"],
                    [Bookmark, "Sync bookmarks via Supabase"],
                  ].map(([Icon, text]) => (
                    <li key={text as string} className="flex items-center gap-3 text-sm font-medium">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10">
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      {text as string}
                    </li>
                  ))}
                </ul>
                <Link href="/app/read" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Open the Reader <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* image side — slides in from right, slightly delayed */}
              <div className="reveal reveal-right reveal-d2 relative">
                <div className="absolute -inset-4 rounded-3xl bg-blue-500/5 -z-10" />
                <div className="relative rounded-2xl shadow-xl border border-border bg-card p-6 md:p-8 overflow-hidden w-full min-h-[400px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-60 z-0" />

                  <div className="relative z-10 flex flex-col gap-4 pointer-events-none select-none">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-border pb-4 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="font-bold text-lg leading-tight">Surah Al-Kahf</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Verses 1-10</p>
                      </div>
                    </div>

                    {/* Ayah 1 */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground mt-1">
                          1
                        </div>
                        <p className="text-2xl font-serif text-right leading-loose" dir="rtl">
                          ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجًا ۜ
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground pl-12 leading-relaxed">
                        [All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.
                      </p>
                    </div>

                    {/* Ayah 2 */}
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground mt-1">
                          2
                        </div>
                        <p className="text-2xl font-serif text-right leading-loose" dir="rtl">
                          قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground pl-12 leading-relaxed">
                        [He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE 2: Memorization ────────────────── */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-linear-to-bl from-emerald-950/30 via-card to-card dark:from-emerald-950/20 dark:via-background dark:to-background">
          {/* Decorative floating orbs */}
          <div className="absolute top-20 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-64 h-64 bg-teal-500/8 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-400/5 dark:bg-emerald-400/3 rounded-full blur-3xl pointer-events-none" />
          <div className="container relative z-10 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* image side — slides in from left */}
              <div className="reveal reveal-left reveal-d2 relative order-2 md:order-1">
                <div className="absolute -inset-4 rounded-3xl bg-emerald-500/5 -z-10" />
                <div className="relative rounded-2xl shadow-xl border border-border bg-card p-6 md:p-8 overflow-hidden w-full min-h-[400px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-60 z-0" />

                  <div className="relative z-10 flex flex-col">

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4 pointer-events-none">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <span className="font-bold text-lg leading-tight">Memorization</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Track your progress</p>
                      </div>
                    </div>

                    {/* Active Goal */}
                    <div className="rounded-xl border border-border bg-linear-to-br from-card to-emerald-500/5 p-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        {/* Circular progress */}
                        <div className="relative w-14 h-14 shrink-0">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="12" className="text-secondary" />
                            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor"
                              strokeWidth="12" className="text-emerald-500" strokeDasharray="180 276.46" strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold mt-1">65%</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" /> Active Goal
                          </div>
                          <h4 className="font-bold text-sm truncate">Surah An-Naba</h4>
                          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                            <span>Day 16 of 30</span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">26/40 verses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Today's Target Card */}
                    <div className="relative group rounded-xl border border-border bg-linear-to-br from-card to-background p-4 shadow-md flex items-center justify-between gap-4 mt-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" /> Today
                        </div>
                        <h5 className="font-bold text-sm">Verses 27–30</h5>
                        <p className="text-xs text-muted-foreground">4 verses • 3× reps</p>
                      </div>

                      <button className="h-12 w-12 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95">
                        <Play className="h-5 w-5 ml-1 fill-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* text side — slides in from right */}
              <div className="reveal reveal-right space-y-6 order-1 md:order-2">
                <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <Target className="h-3.5 w-3.5 mr-1.5" /> Memorization Planner
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                  Memorize smarter,<br />not harder.
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Pick any Surah or Juz to memorize, set your target deadline, and Qurafy automatically creates a daily verse plan — breaking impossible goals into simple daily check-offs.
                </p>
                <ul className="space-y-3">
                  {[
                    [Target, "Customizable memorization goals"],
                    [CheckCircle, "Daily verse check-off"],
                    [BarChart2, "Visual progress tracking"],
                  ].map(([Icon, text]) => (
                    <li key={text as string} className="flex items-center gap-3 text-sm font-medium">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
                        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      {text as string}
                    </li>
                  ))}
                </ul>
                <Link href="/app/memorize" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Start your plan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE 3: Khatam ──────────────────────── */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-linear-to-br from-orange-950/30 via-card to-card dark:from-orange-950/20 dark:via-background dark:to-background">
          {/* Decorative floating orbs */}
          <div className="absolute top-10 -left-10 w-72 h-72 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-amber-500/8 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-orange-400/5 dark:bg-orange-400/3 rounded-full blur-3xl pointer-events-none" />
          <div className="container relative z-10 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* text side — slides in from left */}
              <div className="reveal reveal-left space-y-6">
                <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-700 dark:text-orange-400">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" /> Khatam Tracker
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                  Finish the Quran<br />on your schedule.
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Whether you want to finish in 30 days for Ramadan or 90 days at your own pace, Qurafy calculates your exact daily reading target and keeps you on track.
                </p>
                <ul className="space-y-3">
                  {[
                    [Calendar, "Set any Khatam timeline"],
                    [BookOpen, "Daily Surah & verse range guidance"],
                    [CheckCircle, "One-tap progress check-off"],
                  ].map(([Icon, text]) => (
                    <li key={text as string} className="flex items-center gap-3 text-sm font-medium">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10">
                        <Icon className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      </div>
                      {text as string}
                    </li>
                  ))}
                </ul>
                <Link href="/app/tracker" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Plan your Khatam <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* image side — slides in from right */}
              <div className="reveal reveal-right reveal-d2 relative">
                <div className="absolute -inset-4 rounded-3xl bg-orange-500/5 -z-10" />
                <div className="relative rounded-2xl shadow-xl border border-border bg-card p-6 md:p-8 overflow-hidden w-full min-h-[400px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl opacity-60 z-0" />

                  <div className="relative z-10 flex flex-col gap-4 pointer-events-none select-none">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                          <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <span className="font-bold text-lg leading-tight">Ramadan Plan</span>
                          <p className="text-xs text-muted-foreground mt-0.5">30 days to completion</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">Juz 8</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Day 8 / 30</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-foreground">Overall Progress</span>
                        <span className="text-orange-600 dark:text-orange-400">26%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full w-[26%]"></div>
                      </div>
                    </div>

                    {/* Daily Target */}
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm">Today&apos;s Target</h4>
                        <span className="rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 text-xs font-medium">12 Pages Left</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between group border border-border/50 rounded-lg p-3 bg-secondary/30">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card border border-border text-[10px] text-muted-foreground">
                              1
                            </div>
                            <div>
                              <p className="text-sm font-medium">Al-An&apos;am (6:111 - 6:140)</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Pages 142 - 146</p>
                            </div>
                          </div>
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-orange-500/50 text-orange-500 bg-orange-500/10">
                            <CheckCircle className="h-3 w-3" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between group border border-border/50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground">
                              2
                            </div>
                            <div>
                              <p className="text-sm font-medium">Al-An&apos;am (6:141 - 6:165)</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Pages 147 - 150</p>
                            </div>
                          </div>
                          <div className="h-5 w-5 rounded-full border border-border bg-card" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING / SUPPORT ────────────────────────── */}
        <section id="pricing" className="py-24 md:py-32 px-4 relative overflow-hidden">
          {/* subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

          <div className="container max-w-6xl mx-auto space-y-16">
            <div className="reveal reveal-up text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Support Our Mission</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                Qurafy is built by a small team dedicated to helping Muslims worldwide build better habits. Support us to keep the be app better.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Pro Plan (Donate Only) */}
              <div className="reveal reveal-scale flex flex-col justify-between p-8 rounded-[2.5rem] border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-secondary text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                  Sadaqah
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Qurafy Pro</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">Support our mission with any amount and unlock all Pro features as a gift of appreciation.</p>
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-black">Any Amount</span>
                    <span className="text-muted-foreground text-sm font-bold">/ month</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Unlimited Memorization Goals",
                      "Advanced Analytics & Charts",
                      "Exclusive Premium Reciters",
                      "Custom Theme Personalization",
                      "Support our Mission",
                    ].map((feat) => (
                      <div key={feat} className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle className="h-4 w-4 text-primary" /> {feat}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full h-12 rounded-full border-2 border-primary/20 bg-primary/5 text-primary font-black text-sm hover:bg-primary hover:text-white transition-all mt-10">
                  Donate to Unlock Pro
                </button>
              </div>

              {/* Lifetime Supporter (Fixed Price) */}
              <div className="reveal reveal-scale md:reveal-d2 flex flex-col justify-between p-8 rounded-[2.5rem] border-2 border-amber-500 bg-amber-500/5 shadow-2xl shadow-amber-500/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                  Lifetime
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Heart className="h-7 w-7 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Lifetime Supporter</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">Be a pillar of our community. A one-time fixed contribution for permanent founding status.</p>
                  </div>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-black">IDR 200K</span>
                    <span className="text-muted-foreground text-sm font-bold">/ year</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle className="h-4 w-4 text-amber-500" /> Everything in Pro Access
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle className="h-4 w-4 text-amber-500" /> Exclusive 'Founding' Badge
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle className="h-4 w-4 text-amber-500" /> Private Discord Channel
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle className="h-4 w-4 text-amber-500" /> Future Beta Access
                    </div>
                  </div>
                </div>
                <button className="w-full h-12 rounded-full bg-amber-500 text-white font-black text-sm hover:bg-amber-600 hover:shadow-xl hover:-translate-y-0.5 transition-all mt-10">
                  Become a Supporter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMMUNITY STATS ──────────────────────────────────── */}
        <section className="py-16 bg-background border-y border-border/40">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                ["12,400+", "Active Users", "reveal-d1"],
                ["8,250+", "Khatams Done", "reveal-d2"],
                ["1.5M+", "Verses Memorized", "reveal-d3"],
                ["98%", "Consistency Rate", "reveal-d4"],
              ].map(([num, label, delay]) => (
                <div key={label} className={`reveal reveal-up ${delay} space-y-1`}>
                  <p className="text-4xl font-bold text-primary">{num}</p>
                  <p className="text-sm text-muted-foreground font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────── */}
        <section className="py-24 md:py-32 px-4">
          <div className="reveal reveal-scale container max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Start your Quran journey<br />today — for free.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No credit card. No subscription. Just you, the Quran, and a simple plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/app" className="inline-flex items-center justify-center gap-2 h-13 rounded-full bg-foreground text-background px-10 py-3.5 text-base font-semibold hover:bg-foreground/90 transition-colors shadow">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Qurafy.io</span>
          </div>
          <p className="text-sm text-muted-foreground">Built for better Quran habits. © 2026 Qurafy.</p>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
