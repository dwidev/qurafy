import { BookMarked, Calendar, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default function TrackerPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" /> Khatam Tracker
        </h2>
        <button className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground border border-border rounded-full hover:bg-muted transition-colors shadow-sm">
          Edit Schedule
        </button>
      </div>

      {/* Hero Tracker Card */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/90 to-primary/60 p-6 md:p-10 text-primary-foreground shadow-lg relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18,97,-2.4C97.1,13.1,91.3,28.8,81.8,42.2C72.3,55.5,59,66.4,44.7,75.2C30.4,84,15.2,90.6,-0.6,91.5C-16.4,92.5,-32.8,87.7,-47.1,79C-61.4,70.3,-73.6,57.7,-82.1,43.2C-90.6,28.7,-95.4,12.3,-94.9,-3.8C-94.4,-20,-88.6,-35.8,-79,-49.4C-69.4,-63,-56,-74.3,-41.8,-81.4C-27.6,-88.5,-13.8,-91.4,0.7,-92.6C15.2,-93.7,30.5,-93.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
              Ramadan Challenge
            </div>
            <h3 className="text-3xl md:text-4xl font-bold">Day 5 of 30</h3>
            <p className="text-primary-foreground/80 max-w-md">
              You are staying perfectly on track. Keep up the good work to finish on time!
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-black/20 rounded-2xl p-6 backdrop-blur-md border border-white/10 min-w-[160px]">
            <span className="text-sm font-medium opacity-80 mb-1">Overall Progress</span>
            <span className="text-4xl font-bold">16%</span>
            <span className="text-xs opacity-70 mt-2">Juz 5 / 30</span>
          </div>
        </div>

        <div className="w-full bg-black/20 rounded-full h-1.5 mt-8 backdrop-blur-md">
          <div className="bg-white h-1.5 rounded-full" style={{ width: "16%" }}></div>
        </div>
      </div>

      {/* Today's Target Card */}
      <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">Today's Reading Plan</h3>
            <span className="text-sm font-medium text-muted-foreground">March 5, 2026</span>
          </div>
          <p className="text-muted-foreground mb-6">Read from Juz 5 to complete today's quota.</p>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full bg-background rounded-xl p-4 border border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Start</p>
                <div className="font-bold text-lg">An-Nisa (4:24)</div>
              </div>
              <BookMarked className="h-5 w-5 text-primary opacity-50" />
            </div>
            
            <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
            <div className="h-5 w-px bg-border md:hidden" />
            
            <div className="flex-1 w-full bg-background rounded-xl p-4 border border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">End</p>
                <div className="font-bold text-lg">An-Nisa (4:147)</div>
              </div>
              <BookMarked className="h-5 w-5 text-primary opacity-50" />
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card">
          <div className="text-sm text-muted-foreground">
            Estimated reading time: <span className="font-semibold text-foreground">45 mins</span> (20 pages)
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link 
              href="/app/read/4" 
              className="flex-1 sm:flex-none inline-flex h-11 items-center justify-center rounded-full bg-secondary px-6 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Play className="mr-2 h-4 w-4" /> Start Reading
            </Link>
            <button className="flex-1 sm:flex-none inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Mark Complete
            </button>
          </div>
        </div>
      </div>
      
      {/* Upcoming Days Preview */}
      <div className="pt-6">
        <h3 className="font-bold mb-4">Upcoming Schedule</h3>
        <div className="grid gap-3">
          {[
            { day: 6, juz: 6, surah: "Al-Ma'idah (5:1 - 5:81)", date: "Tomorrow" },
            { day: 7, juz: 7, surah: "Al-Ma'idah (5:82) - Al-An'am (6:110)", date: "Mar 7" },
            { day: 8, juz: 8, surah: "Al-An'am (6:111) - Al-A'raf (7:87)", date: "Mar 8" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-muted text-xs">
                  <span className="font-bold">Day</span>
                  <span className="font-medium text-muted-foreground">{item.day}</span>
                </div>
                <div>
                  <h4 className="font-medium">Juz {item.juz}</h4>
                  <p className="text-sm text-muted-foreground">{item.surah}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-medium hidden sm:block">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
