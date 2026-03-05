import { BookMarked, Calendar, ChevronRight, Play, CheckCircle2, MoreVertical, Edit2, Clock } from "lucide-react";
import Link from "next/link";

export default function TrackerPage() {
  return (
    <div className="flex-1 space-y-6 md:space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">
      
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </span>
            Khatam Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Read systematically to complete the Quran by your target date.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-secondary border border-border rounded-full hover:bg-muted transition-colors shadow-sm">
          <Edit2 className="h-4 w-4" /> Edit Schedule
        </button>
      </div>

      {/* ── Hero Tracker Card ───────────────────────────── */}
      <div className="group relative rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 md:p-10 text-primary-foreground shadow-lg overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none transition-transform group-hover:scale-110 duration-700" />
        
        {/* Soft SVG Pattern */}
        <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none">
          <svg width="250" height="250" viewBox="0 0 200 200">
            <path fill="currentColor" d="M38.8,-69.5C51,-62.7,62,-53,70.9,-41.2C79.8,-29.3,86.6,-15.4,85.2,-1.9C83.9,11.5,74.5,24.5,64.2,35.4C53.9,46.3,42.7,55.1,30.3,62.8C18,70.5,4.6,77.1,-8.6,76.5C-21.8,75.9,-34.8,68.1,-46.3,58.8C-57.8,49.5,-67.7,38.8,-74.6,26C-81.5,13.2,-85.4,-1.8,-83.1,-15.8C-80.8,-29.8,-72.3,-42.8,-61,-49.5C-49.8,-56.3,-35.8,-56.9,-23.4,-61.7C-11,-66.6,0,-75.7,13.2,-74.3C26.4,-72.9,38,-61,38.8,-69.5Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Main Info */}
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 backdrop-blur-md px-3 py-1.5 text-xs font-semibold tracking-wide uppercase text-white">
              Ramadan Challenge
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-5xl font-bold">Day 5 of 30</h2>
              <p className="text-white/80 leading-relaxed max-w-md pt-2 text-sm md:text-base">
                You're staying perfectly on track. Keep up the good work to finish on your target date!
              </p>
            </div>
          </div>
          
          {/* Circular Progress Badge */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-black/15 rounded-3xl p-6 backdrop-blur-md border border-white/10 w-full md:w-auto shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-2">Overall</span>
            <span className="text-5xl font-bold tracking-tight">16<span className="text-3xl opacity-80">%</span></span>
            <span className="text-sm text-white/80 mt-2 font-medium">Juz 5 <span className="opacity-50 mx-1">/</span> 30</span>
          </div>
        </div>

        {/* Linear Progress */}
        <div className="relative z-10 mt-10">
          <div className="flex justify-between text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
            <span>Started</span>
            <span>Target: Ramadan 29</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2.5 backdrop-blur-md border border-white/5 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: "16%" }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Today's Focus Card ──────────────────────────── */}
      <div className="rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-secondary to-background p-6 md:p-8 border-b border-border/60">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Today's Target
              </div>
              <h3 className="text-2xl font-bold">Read from Juz 5</h3>
              <p className="text-muted-foreground text-sm">March 5, 2026</p>
            </div>
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 text-muted-foreground transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content Body */}
        <div className="p-6 md:p-8 bg-card space-y-8">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Start point */}
            <div className="flex-1 w-full relative rounded-2xl border border-border bg-background p-5 shadow-sm hover:border-primary/40 transition-colors">
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BookMarked className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">Start Point</p>
              <p className="text-xl font-bold">An-Nisa</p>
              <p className="text-sm font-medium text-foreground/70 mt-0.5">Verse 24</p>
            </div>
            
            <ChevronRight className="h-6 w-6 text-muted-foreground/40 hidden md:block flex-shrink-0 group-hover:text-primary transition-colors" />
            <div className="h-6 w-px bg-border md:hidden" />
            
            {/* End point */}
            <div className="flex-1 w-full relative rounded-2xl border border-border bg-background p-5 shadow-sm hover:border-primary/40 transition-colors">
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">Target End</p>
              <p className="text-xl font-bold">An-Nisa</p>
              <p className="text-sm font-medium text-foreground/70 mt-0.5">Verse 147</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Est. time: <span className="font-bold text-foreground mx-1">~45 mins</span> (20 pages)
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link 
                href="/app/read" 
                className="flex-1 sm:flex-none inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all"
              >
                <Play className="mr-2 h-4 w-4 fill-primary-foreground" /> Start Reading
              </Link>
              <button className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted transition-colors" title="Mark completely done">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-emerald-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* ── Upcoming Schedule ─────────────────────────────── */}
      <div className="pt-2">
        <h3 className="text-lg font-bold mb-4">Upcoming Schedule</h3>
        <div className="flex flex-col gap-3">
          {[
            { day: 6, juz: 6, surah: "Al-Ma'idah (5:1 — 5:81)",            date: "Tomorrow" },
            { day: 7, juz: 7, surah: "Al-Ma'idah (5:82) — Al-An'am (6:110)", date: "Mar 7" },
            { day: 8, juz: 8, surah: "Al-An'am (6:111) — Al-A'raf (7:87)",   date: "Mar 8" },
          ].map((item, i) => (
            <div key={i} className="group flex items-center justify-between p-4 md:p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all cursor-default">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground group-hover:text-primary transition-colors">Day</span>
                  <span className="text-lg font-bold leading-none text-foreground group-hover:text-primary transition-colors">{item.day}</span>
                </div>
                <div>
                  <h4 className="font-bold text-base">Juz {item.juz}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.surah}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:block bg-secondary px-3 py-1 rounded-full">
                  {item.date}
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
