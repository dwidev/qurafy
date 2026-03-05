import Link from "next/link";
import { BookOpen, Calendar, Target, Flame, TrendingUp, Clock, ChevronRight } from "lucide-react";

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

      {/* ── Features Grid ───────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Memorization */}
        <Link href="/app/memorize" className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-6 space-y-1.5">
            <h3 className="font-bold text-lg">Memorization Planner</h3>
            <p className="text-sm text-muted-foreground">
              Review your daily target: An-Naba, Verses 1-5. Keep your memorization streak alive.
            </p>
          </div>
        </Link>

        {/* Khatam Tracker */}
        <Link href="/app/tracker" className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-6 space-y-1.5">
            <h3 className="font-bold text-lg">Khatam Progress</h3>
            <p className="text-sm text-muted-foreground">
              Day 5 of 30. You are staying perfectly on track to finish your Ramadan Khatam.
            </p>
          </div>
        </Link>
      </div>
      
    </div>
  );
}
