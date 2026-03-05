import Link from "next/link";
import { BookOpen, Calendar, Target, Flame, TrendingUp, Clock, ChevronRight, Quote, History } from "lucide-react";

export default function AppDashboard() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">
      
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-primary text-xl">👋</span>
            </span>
            Assalamu'alaikum, User
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back to your daily Quran journey.
          </p>
        </div>
      </div>

      {/* ── Quick Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Flame,      label: "Current Streak", value: "16 Days", color: "text-orange-500", bg: "bg-orange-50" },
          { icon: Clock,      label: "Time Read",      value: "14h 20m", color: "text-blue-600",   bg: "bg-blue-50" },
          { icon: BookOpen,   label: "Verses Read",    value: "1,240",   color: "text-emerald-600",bg: "bg-emerald-50" },
          { icon: TrendingUp, label: "Weekly Goal",    value: "80%",     color: "text-primary",    bg: "bg-primary/10" },
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

      {/* ── Daily Inspiration ───────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden group hover:border-primary/20 transition-all">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-primary transition-opacity group-hover:opacity-10">
          <Quote className="h-32 w-32 -rotate-6" />
        </div>
        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Quote className="h-5 w-5" />
        </div>
        <div className="space-y-3 flex-1 z-10 w-full text-center md:text-left">
          <p className="text-xl md:text-2xl font-serif text-foreground/90 font-medium leading-loose md:leading-loose" dir="rtl">
            فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا
          </p>
          <div className="space-y-1">
            <p className="text-sm font-medium italic text-muted-foreground">
              "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease."
            </p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider pt-1">
              — Surah Ash-Sharh (94:5-6)
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Action: Continue Reading ───────────────── */}
      <div className="group relative rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 md:p-8 shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden">
        {/* subtle background glow */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Continue Reading
            </div>
            
            <div className="space-y-1">
              <h2 className="text-3xl font-bold truncate">Surah Al-Kahf</h2>
              <p className="text-muted-foreground text-sm">Verse 10 — The Cave</p>
            </div>
            
            <p className="text-2xl font-serif text-foreground/80 font-bold hidden sm:block pt-2" dir="rtl">
              إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link 
              href="/app/read" 
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Resume Reading <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Active Goals & Progress ───────────────────────── */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold px-1">Your Progress</h2>
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* Memorization Progress */}
          <Link href="/app/memorize" className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Memorization</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span> Active Target
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50/50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
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
                <div className="h-full bg-emerald-500 rounded-full w-[38%] transition-all duration-1000 ease-in-out relative">
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Daily Goal: 5 Verses</span>
                <span className="font-medium text-emerald-600 px-2 py-0.5 rounded bg-emerald-50">On Track</span>
              </div>
            </div>
          </Link>

          {/* Khatam Tracker */}
          <Link href="/app/tracker" className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-inner">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Khatam Progress</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className="flex h-2 w-2 rounded-full bg-orange-500"></span> Ramadan Plan
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50/50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
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
                <div className="h-full bg-orange-500 rounded-full w-[26%] transition-all duration-1000 ease-in-out relative">
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Today's Target: 20 Pages</span>
                <span className="font-medium text-orange-500 px-2 py-0.5 rounded bg-orange-50">12 Pages Left</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Recent Activity ─────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">Jump Back In</h2>
          <Link href="/app/read" className="text-sm text-primary hover:underline font-medium">View History</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {[
            { surah: "Al-Baqarah", verse: "Verse 255 (Ayatul Kursi)", time: "2 hours ago" },
            { surah: "Yaseen", verse: "Verse 1-10", time: "Yesterday" },
            { surah: "Al-Mulk", verse: "Completed", time: "2 days ago" },
          ].map((item) => (
            <Link key={item.surah} href="/app/read" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <History className="h-5 w-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate">{item.surah}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground truncate mr-2">{item.verse}</p>
                  <p className="text-[10px] text-muted-foreground/50 whitespace-nowrap font-medium">{item.time}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  );
}
