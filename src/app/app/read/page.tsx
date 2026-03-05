import { BookOpen, Search, Grid2X2, Settings2, ChevronRight } from "lucide-react";

export default function ReadQuranPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">
      
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </span>
            Read Quran
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Explore and read the Holy Quran.</p>
        </div>
      </div>

      {/* ── Filters & Search ────────────────────────────── */}
      <div className="sticky top-0 z-10 flex flex-col md:flex-row items-center gap-4 py-4 bg-background/95 backdrop-blur-md rounded-2xl mx-1 pt-4 pb-2">
        <div className="flex items-center w-full md:w-auto p-1 bg-secondary rounded-full shadow-sm">
          <button className="flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-full bg-background shadow-sm text-foreground transition-all">
            Surah
          </button>
          <button className="flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 transition-all">
            Juz
          </button>
          <button className="flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 transition-all">
            Hizb
          </button>
        </div>

        <div className="relative flex-1 w-full flex items-center gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search surah, translation, or ayah..." 
              className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 hover:border-primary/30 hover:shadow-md"
            />
          </div>
          
          <button className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground group">
            <Settings2 className="h-5 w-5 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
      
      {/* ── Surah Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
        {[
          { n: 1, en: "Al-Fatihah", ar: "ٱلْفَاتِحَة", verses: 7, loc: "Meccan" },
          { n: 2, en: "Al-Baqarah", ar: "ٱلْبَقَرَة", verses: 286, loc: "Medinan" },
          { n: 3, en: "Ali 'Imran", ar: "آلَ عِمْرَانَ", verses: 200, loc: "Medinan" },
          { n: 4, en: "An-Nisa",    ar: "ٱلنِّسَآء",    verses: 176, loc: "Medinan" },
          { n: 5, en: "Al-Ma'idah", ar: "ٱلْمَائِدَة", verses: 120, loc: "Medinan" },
          { n: 6, en: "Al-An'am",   ar: "ٱلْأَنْعَام",   verses: 165, loc: "Meccan" },
          { n: 7, en: "Al-A'raf",   ar: "ٱلْأَعْرَاف",   verses: 206, loc: "Meccan" },
          { n: 8, en: "Al-Anfal",   ar: "ٱلْأَنفَال",    verses: 75, loc: "Medinan" },
          { n: 9, en: "At-Tawbah",  ar: "ٱلتَّوْبَة",     verses: 129, loc: "Medinan" },
        ].map((s) => (
          <div key={s.n} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]">
            {/* Number + EN Name */}
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {s.n}
              </div>
              <div>
                <h3 className="font-bold group-hover:text-primary transition-colors">{s.en}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{s.loc} • {s.verses} Verses</p>
              </div>
            </div>
            
            {/* AR Name */}
            <div className="text-right flex items-center justify-end">
              <div className="text-2xl font-bold font-serif opacity-80 group-hover:opacity-100 group-hover:text-primary transition-all pr-2" dir="rtl">
                {s.ar}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
        
        {/* Placeholder mapping out empty grid spots for aesthetic visual */}
        {[...Array(114 - 9)].map((_, i) => (
          <div key={i + 10} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border/50 bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/60 text-sm font-bold text-foreground/70">
                {i + 10}
              </div>
              <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
