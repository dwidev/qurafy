import Link from "next/link";
import { BookOpen, Calendar, Target, Flame, TrendingUp, Clock, ChevronRight, Quote, History, MapPin, Compass, Sparkles, Trophy } from "lucide-react";

export default function AppDashboard() {
  // Mock flag for fresh login - set to true to see empty states for new user
  const isNewUser = false;

  // Mock prayer times (as might be seen in a premium Islamic SaaS)
  const prayerTimes = [
    { name: "Fajr", time: "04:42", active: false },
    { name: "Dhuhr", time: "12:05", active: true },
    { name: "Asr", time: "15:20", active: false },
    { name: "Maghrib", time: "18:12", active: false },
    { name: "Isha", time: "19:25", active: false },
  ];

  // Mock data for Continue Reading section
  const readingQuranData: any = isNewUser ? null : {
    surah: "Surah Al-Kahf",
    verse: "Verse 10 — The Cave",
    arabic: "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً",
    link: "/app/read",
  };

  const khatamProgressData: any = isNewUser ? null : {
    surah: "Surah Ya-Sin",
    verse: "Verse 40 — The Sun & Moon",
    arabic: "لَا ٱلشَّمْسُ يَنۢبَغِى لَهَآ أَن تُدْرِكَ ٱلْقَمَرَ وَلَا ٱلَّيْلُ سَابِقُ ٱلنَّهَارِ",
    link: "/app/tracker",
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-32">

      {/* ── Prayer Times Top Bar ─────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-1 md:pr-4 rounded-4xl border border-border bg-card shadow-sm group hover:border-primary/20 transition-all">
        <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-4 py-2 self-start md:self-auto w-full md:w-auto">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold truncate">Jakarta, ID</span>
          <div className="h-4 w-px bg-border/50 mx-1" />
          <Compass className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold">295° NW</span>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
          {prayerTimes.map((p) => (
            <div key={p.name} className="flex flex-col items-center min-w-[50px]">
              <span className={`text-[10px] font-black uppercase tracking-widest ${p.active ? "text-primary" : "text-muted-foreground"}`}>{p.name}</span>
              <span className={`text-sm font-black ${p.active ? "text-foreground" : "text-muted-foreground/60"}`}>{p.time}</span>
              {p.active && <div className="h-1 w-4 bg-primary rounded-full mt-1 animate-pulse" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
              <span className="text-primary text-xl">👋</span>
            </span>
            Assalamu'alaikum, User
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            Wednesday, March 5, 2026 • 7 Ramadan 1447 AH
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card shadow-sm hover:shadow-md transition-all">
            <History className="h-4 w-4 text-muted-foreground" />
          </button>
          <Link href="/app/settings" className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card shadow-sm hover:shadow-md transition-all">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* ── Quick Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Flame, label: "Current Streak", value: isNewUser ? "0 Days" : "16 Days", color: "text-orange-500", bg: "bg-orange-50" },
          { icon: Clock, label: "Time Read", value: isNewUser ? "0h 0m" : "14h 20m", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: BookOpen, label: "Verses Read", value: isNewUser ? "0" : "1,240", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: TrendingUp, label: "Weekly Goal", value: isNewUser ? "0%" : "80%", color: "text-primary", bg: "bg-primary/10" },
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
      {/* ── Main Action: Continue Reading & Khatam ────────── */}
      {(!readingQuranData && !khatamProgressData) ? (
        <div className="group relative rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 md:p-10 shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden text-center flex flex-col items-center justify-center space-y-5">
          {/* subtle background glow */}
          <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold relative z-10">Start Your Quran Journey</h2>
          <p className="text-muted-foreground max-w-md relative z-10">
            Begin reading the Quran or start a Khatam plan to track your daily progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10 pt-2">
            <Link href="/app/read" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
              Start Reading
            </Link>
            <Link href="/app/tracker" className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
              Start Khatam
            </Link>
          </div>
        </div>
      ) : (
        <div className="group relative rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden flex flex-col md:flex-row">
          {/* subtle background glow */}
          <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />

          {/* Reading Quran Side */}
          {readingQuranData && (
            <div className={`relative z-10 flex flex-col justify-between p-6 md:p-8 ${khatamProgressData ? 'md:w-1/2 border-b md:border-b-0 md:border-r border-primary/10' : 'w-full flex-col md:flex-row md:items-center gap-6'}`}>
              <div className="space-y-4 mb-6 md:mb-0 max-w-lg">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Continue Reading | <span className="text-blue-500">Reading Quran</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-bold truncate">{readingQuranData.surah}</h2>
                  <p className="text-muted-foreground text-sm">{readingQuranData.verse}</p>
                </div>
                <p className="text-xl md:text-2xl font-serif text-foreground/80 font-bold hidden sm:block pt-2" dir="rtl">
                  {readingQuranData.arabic}
                </p>
              </div>
              <div className={khatamProgressData ? "mt-4" : "shrink-0"}>
                <Link
                  href={readingQuranData.link}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Resume <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Khatam Progress Side */}
          {khatamProgressData && (
            <div className={`relative z-10 flex flex-col justify-between p-6 md:p-8 ${readingQuranData ? 'md:w-1/2' : 'w-full flex-col md:flex-row md:items-center gap-6'}`}>
              <div className="space-y-4 mb-6 md:mb-0 max-w-lg">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Continue Reading | <span className="text-orange-500">Khatam Progress</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-bold truncate">{khatamProgressData.surah}</h2>
                  <p className="text-muted-foreground text-sm">{khatamProgressData.verse}</p>
                </div>
                <p className="text-xl md:text-2xl font-serif text-foreground/80 font-bold hidden sm:block pt-2" dir="rtl">
                  {khatamProgressData.arabic}
                </p>
              </div>
              <div className={readingQuranData ? "mt-4" : "flex-shrink-0"}>
                <Link
                  href={khatamProgressData.link}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Resume <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Active Goals & Progress ───────────────────────── */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold px-1">Your Progress</h2>
        <div className="grid md:grid-cols-2 gap-4">

          {/* Memorization Progress */}
          {isNewUser ? (
            <div className="group flex flex-col justify-center items-center text-center rounded-3xl border border-dashed border-border bg-card/50 p-6 md:p-8 hover:bg-card hover:border-emerald-500/30 transition-all min-h-[240px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Start Memorizing</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
                Set a daily target and track your Quran memorization journey.
              </p>
              <Link href="/app/memorize" className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-500/10 px-6 text-sm font-semibold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all">
                Set Target
              </Link>
            </div>
          ) : (
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
          )}

          {/* Khatam Tracker */}
          {isNewUser ? (
            <div className="group flex flex-col justify-center items-center text-center rounded-3xl border border-dashed border-border bg-card/50 p-6 md:p-8 hover:bg-card hover:border-orange-500/30 transition-all min-h-[240px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Start a Khatam Plan</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
                Plan your reading to completely finish the Quran in your preferred time.
              </p>
              <Link href="/app/tracker" className="inline-flex h-10 items-center justify-center rounded-full bg-orange-500/10 px-6 text-sm font-semibold text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                Create Plan
              </Link>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* ── Recent Activity ─────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">Jump Back In</h2>
          <Link href="/app/read" className="text-sm text-primary hover:underline font-medium">View History</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {isNewUser ? (
            <div className="col-span-full flex flex-col items-center justify-center py-10 px-4 text-center rounded-3xl border border-dashed border-border bg-card/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-3">
                <History className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Your reading history will appear here once you start exploring the Quran.
              </p>
            </div>
          ) : (
            [
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
            ))
          )}
        </div>
      </div>

    </div>
  );
}
