import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import ScrollAnimator from "@/components/ScrollAnimator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] text-foreground font-sans overflow-x-hidden">

      {/* ── IntersectionObserver (client) drives all .reveal elements ── */}
      <ScrollAnimator />

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <header className="sticky top-4 z-50 flex justify-center px-4">
        <div className="w-full max-w-5xl flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 backdrop-blur-md px-5 py-3 shadow-sm">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Qurafy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#preview"  className="hover:text-foreground transition-colors">Preview</Link>
            <Link href="#pricing"  className="hover:text-foreground transition-colors">Pricing</Link>
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
            <Link href="#preview" className="inline-flex items-center justify-center h-12 rounded-full border border-input bg-background px-8 text-sm font-medium hover:bg-muted transition-colors shadow-sm">
              See how it works
            </Link>
          </div>

          {/* trust stats */}
          <div className="reveal reveal-up reveal-d4 flex items-center gap-6 mt-8 text-sm text-muted-foreground">
            {[["114", "Surahs"], ["30", "Juz"], ["6,236", "Verses"]].map(([n, l]) => (
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
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl -z-10 scale-110" />
            <div className="rounded-3xl border border-black/10 bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-black/5 bg-gray-50/80">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">qurafy.io/app/read</span>
                </div>
              </div>
              <div className="p-6 md:p-8 bg-white">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Popular Surahs</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { n: 1, ar: "ٱلْفَاتِحَة", en: "Al-Fatihah", v: "7 Verses" },
                    { n: 18, ar: "ٱلْكَهْف", en: "Al-Kahf", v: "110 Verses" },
                    { n: 36, ar: "يس", en: "Ya-Sin", v: "83 Verses" },
                    { n: 55, ar: "ٱلرَّحْمَٰن", en: "Ar-Rahman", v: "78 Verses" },
                    { n: 56, ar: "ٱلْوَاقِعَة", en: "Al-Waqi'ah", v: "96 Verses" },
                    { n: 67, ar: "ٱلْمُلْك", en: "Al-Mulk", v: "30 Verses" },
                  ].map((s) => (
                    <div key={s.n} className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 md:p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary flex-shrink-0">
                          {s.n}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{s.en}</p>
                          <p className="text-xs text-muted-foreground">{s.v}</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-foreground/80 hidden md:block font-serif" dir="rtl">{s.ar}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE 1: Reader ──────────────────────── */}
        <section id="features" className="py-20 md:py-28 px-4 bg-white">
          <div className="container max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* text side — slides in from left */}
              <div className="reveal reveal-left space-y-6">
                <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
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
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50">
                        <Icon className="h-4 w-4 text-blue-600" />
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
                <div className="absolute -inset-4 rounded-3xl bg-blue-50/50 -z-10" />
                <Image
                  src="/mockup-reader.png"
                  alt="Qurafy Surah Reader"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-xl border border-black/10 w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE 2: Memorization ────────────────── */}
        <section className="py-20 md:py-28 px-4 bg-[#f8f9fc]">
          <div className="container max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* image side — slides in from left */}
              <div className="reveal reveal-left reveal-d2 relative order-2 md:order-1">
                <div className="absolute -inset-4 rounded-3xl bg-emerald-50/50 -z-10" />
                <div className="relative rounded-2xl shadow-xl border border-black/10 bg-white p-6 md:p-8 overflow-hidden w-full min-h-[400px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50/80 rounded-full blur-3xl opacity-60 z-0" />
                  
                  <div className="relative z-10 flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4 pointer-events-none">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <Target className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-bold text-lg leading-tight">Memorization</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Track your progress</p>
                      </div>
                    </div>

                    {/* Active Goal */}
                    <div className="rounded-xl border border-border bg-gradient-to-br from-card to-emerald-50/50 p-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        {/* Circular progress */}
                        <div className="relative w-[3.5rem] h-[3.5rem] flex-shrink-0">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-100" />
                            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor"
                              strokeWidth="12" className="text-emerald-500" strokeDasharray="180 276.46" strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold mt-1">65%</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Active Goal
                          </div>
                          <h4 className="font-bold text-sm truncate">Surah An-Naba</h4>
                          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                            <span>Day 16 of 30</span>
                            <span className="font-medium text-emerald-600">26/40 verses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Today's Target Card */}
                    <div className="relative group rounded-xl border border-border bg-gradient-to-br from-card to-background p-4 shadow-md flex items-center justify-between gap-4 mt-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" /> Today
                        </div>
                        <h5 className="font-bold text-sm">Verses 27–30</h5>
                        <p className="text-xs text-muted-foreground">4 verses • 3× reps</p>
                      </div>
                      
                      <button className="h-12 w-12 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
                        <Play className="h-5 w-5 ml-1 fill-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* text side — slides in from right */}
              <div className="reveal reveal-right space-y-6 order-1 md:order-2">
                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
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
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                        <Icon className="h-4 w-4 text-emerald-600" />
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
        <section className="py-20 md:py-28 px-4 bg-white">
          <div className="container max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* text side — slides in from left */}
              <div className="reveal reveal-left space-y-6">
                <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
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
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50">
                        <Icon className="h-4 w-4 text-orange-500" />
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
                <div className="absolute -inset-4 rounded-3xl bg-orange-50/40 -z-10" />
                <Image
                  src="/mockup-khatam.png"
                  alt="Qurafy Khatam Tracker"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-xl border border-black/10 w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ──────────────────────────────────── */}
        <section className="py-16 bg-[#f8f9fc] border-y border-border/40">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                ["114",   "Surahs available", "reveal-d1"],
                ["30",    "Juz covered",       "reveal-d2"],
                ["6,236", "Total Ayahs",        "reveal-d3"],
                ["Free",  "Always free",        "reveal-d4"],
              ].map(([num, label, delay]) => (
                <div key={label} className={`reveal reveal-up ${delay} space-y-1`}>
                  <p className="text-4xl font-bold text-primary">{num}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
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
      <footer className="border-t border-border bg-white py-10">
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
