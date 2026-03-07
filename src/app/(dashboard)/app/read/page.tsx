"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Settings2, ChevronRight } from "lucide-react";

const SURAHS = [
  { n: 1, en: "Al-Fatihah", ar: "ٱلْفَاتِحَة", verses: 7, loc: "Meccan" },
  { n: 2, en: "Al-Baqarah", ar: "ٱلْبَقَرَة", verses: 286, loc: "Medinan" },
  { n: 3, en: "Ali 'Imran", ar: "آلَ عِمْرَانَ", verses: 200, loc: "Medinan" },
  { n: 4, en: "An-Nisa", ar: "ٱلنِّسَآء", verses: 176, loc: "Medinan" },
  { n: 5, en: "Al-Ma'idah", ar: "ٱلْمَائِدَة", verses: 120, loc: "Medinan" },
  { n: 6, en: "Al-An'am", ar: "ٱلْأَنْعَام", verses: 165, loc: "Meccan" },
  { n: 7, en: "Al-A'raf", ar: "ٱلْأَعْرَاف", verses: 206, loc: "Meccan" },
  { n: 8, en: "Al-Anfal", ar: "ٱلْأَنفَال", verses: 75, loc: "Medinan" },
  { n: 9, en: "At-Tawbah", ar: "ٱلتَّوْبَة", verses: 129, loc: "Medinan" },
  { n: 10, en: "Yunus", ar: "يُونُس", verses: 109, loc: "Meccan" },
  { n: 11, en: "Hud", ar: "هُود", verses: 123, loc: "Meccan" },
  { n: 12, en: "Yusuf", ar: "يُوسُف", verses: 111, loc: "Meccan" },
  { n: 13, en: "Ar-Ra'd", ar: "ٱلرَّعْد", verses: 43, loc: "Medinan" },
  { n: 14, en: "Ibrahim", ar: "إِبْرَاهِيم", verses: 52, loc: "Meccan" },
  { n: 15, en: "Al-Hijr", ar: "ٱلْحِجْر", verses: 99, loc: "Meccan" },
  { n: 16, en: "An-Nahl", ar: "ٱلنَّحْل", verses: 128, loc: "Meccan" },
  { n: 17, en: "Al-Isra", ar: "ٱلْإِسْرَاء", verses: 111, loc: "Meccan" },
  { n: 18, en: "Al-Kahf", ar: "ٱلْكَهْف", verses: 110, loc: "Meccan" },
  { n: 19, en: "Maryam", ar: "مَرْيَم", verses: 98, loc: "Meccan" },
  { n: 20, en: "Ta-Ha", ar: "طه", verses: 135, loc: "Meccan" },
  { n: 21, en: "Al-Anbya", ar: "ٱلْأَنْبِيَاء", verses: 112, loc: "Meccan" },
  { n: 22, en: "Al-Hajj", ar: "ٱلْحَجّ", verses: 78, loc: "Medinan" },
  { n: 23, en: "Al-Mu'minun", ar: "ٱلْمُؤْمِنُون", verses: 118, loc: "Meccan" },
  { n: 24, en: "An-Nur", ar: "ٱلنُّور", verses: 64, loc: "Medinan" },
  { n: 25, en: "Al-Furqan", ar: "ٱلْفُرْقَان", verses: 77, loc: "Meccan" },
  { n: 26, en: "Ash-Shu'ara", ar: "ٱلشُّعَرَاء", verses: 227, loc: "Meccan" },
  { n: 27, en: "An-Naml", ar: "ٱلنَّمْل", verses: 93, loc: "Meccan" },
  { n: 28, en: "Al-Qasas", ar: "ٱلْقَصَص", verses: 88, loc: "Meccan" },
  { n: 29, en: "Al-Ankabut", ar: "ٱلْعَنْكَبُوت", verses: 69, loc: "Meccan" },
  { n: 30, en: "Ar-Rum", ar: "ٱلرُّوم", verses: 60, loc: "Meccan" },
  { n: 31, en: "Luqman", ar: "لُقْمَان", verses: 34, loc: "Meccan" },
  { n: 32, en: "As-Sajdah", ar: "ٱلسَّجْدَة", verses: 30, loc: "Meccan" },
  { n: 33, en: "Al-Ahzab", ar: "ٱلْأَحْزَاب", verses: 73, loc: "Medinan" },
  { n: 34, en: "Saba", ar: "سَبَأ", verses: 54, loc: "Meccan" },
  { n: 35, en: "Fatir", ar: "فَاطِر", verses: 45, loc: "Meccan" },
  { n: 36, en: "Ya-Sin", ar: "يس", verses: 83, loc: "Meccan" },
  { n: 37, en: "As-Saffat", ar: "ٱلصَّافَّات", verses: 182, loc: "Meccan" },
  { n: 38, en: "Sad", ar: "ص", verses: 88, loc: "Meccan" },
  { n: 39, en: "Az-Zumar", ar: "ٱلزُّمَر", verses: 75, loc: "Meccan" },
  { n: 40, en: "Ghafir", ar: "غَافِر", verses: 85, loc: "Meccan" },
  { n: 41, en: "Fussilat", ar: "فُصِّلَت", verses: 54, loc: "Meccan" },
  { n: 42, en: "Ash-Shura", ar: "ٱلشُّورَى", verses: 53, loc: "Meccan" },
  { n: 43, en: "Az-Zukhruf", ar: "ٱلزُّخْرُف", verses: 89, loc: "Meccan" },
  { n: 44, en: "Ad-Dukhan", ar: "ٱلدُّخَان", verses: 59, loc: "Meccan" },
  { n: 45, en: "Al-Jathiyah", ar: "ٱلْجَاثِيَة", verses: 37, loc: "Meccan" },
  { n: 46, en: "Al-Ahqaf", ar: "ٱلْأَحْقَاف", verses: 35, loc: "Meccan" },
  { n: 47, en: "Muhammad", ar: "مُحَمَّد", verses: 38, loc: "Medinan" },
  { n: 48, en: "Al-Fath", ar: "ٱلْفَتْح", verses: 29, loc: "Medinan" },
  { n: 49, en: "Al-Hujurat", ar: "ٱلْحُجُرَات", verses: 18, loc: "Medinan" },
  { n: 50, en: "Qaf", ar: "ق", verses: 45, loc: "Meccan" },
  { n: 51, en: "Ad-Dhariyat", ar: "ٱلذَّارِيَات", verses: 60, loc: "Meccan" },
  { n: 52, en: "At-Tur", ar: "ٱلطُّور", verses: 49, loc: "Meccan" },
  { n: 53, en: "An-Najm", ar: "ٱلنَّجْم", verses: 62, loc: "Meccan" },
  { n: 54, en: "Al-Qamar", ar: "ٱلْقَمَر", verses: 55, loc: "Meccan" },
  { n: 55, en: "Ar-Rahman", ar: "ٱلرَّحْمَٰن", verses: 78, loc: "Medinan" },
  { n: 56, en: "Al-Waqi'ah", ar: "ٱلْوَاقِعَة", verses: 96, loc: "Meccan" },
  { n: 57, en: "Al-Hadid", ar: "ٱلْحَدِيد", verses: 29, loc: "Medinan" },
  { n: 58, en: "Al-Mujadila", ar: "ٱلْمُجَادِلَة", verses: 22, loc: "Medinan" },
  { n: 59, en: "Al-Hashr", ar: "ٱلْحَشْر", verses: 24, loc: "Medinan" },
  { n: 60, en: "Al-Mumtahanah", ar: "ٱلْمُمْتَحَنَة", verses: 13, loc: "Medinan" },
  { n: 61, en: "As-Saf", ar: "ٱلصَّفّ", verses: 14, loc: "Medinan" },
  { n: 62, en: "Al-Jumu'ah", ar: "ٱلْجُمُعَة", verses: 11, loc: "Medinan" },
  { n: 63, en: "Al-Munafiqun", ar: "ٱلْمُنَافِقُون", verses: 11, loc: "Medinan" },
  { n: 64, en: "At-Taghabun", ar: "ٱلتَّغَابُن", verses: 18, loc: "Medinan" },
  { n: 65, en: "At-Talaq", ar: "ٱلطَّلَاق", verses: 12, loc: "Medinan" },
  { n: 66, en: "At-Tahrim", ar: "ٱلتَّحْرِيم", verses: 12, loc: "Medinan" },
  { n: 67, en: "Al-Mulk", ar: "ٱلْمُلْك", verses: 30, loc: "Meccan" },
  { n: 68, en: "Al-Qalam", ar: "ٱلْقَلَم", verses: 52, loc: "Meccan" },
  { n: 69, en: "Al-Haqqah", ar: "ٱلْحَاقَّة", verses: 52, loc: "Meccan" },
  { n: 70, en: "Al-Ma'arij", ar: "ٱلْمَعَارِج", verses: 44, loc: "Meccan" },
  { n: 71, en: "Nuh", ar: "نُوح", verses: 28, loc: "Meccan" },
  { n: 72, en: "Al-Jinn", ar: "ٱلْجِنّ", verses: 28, loc: "Meccan" },
  { n: 73, en: "Al-Muzzammil", ar: "ٱلْمُزَّمِّل", verses: 20, loc: "Meccan" },
  { n: 74, en: "Al-Muddaththir", ar: "ٱلْمُدَّثِّر", verses: 56, loc: "Meccan" },
  { n: 75, en: "Al-Qiyamah", ar: "ٱلْقِيَامَة", verses: 40, loc: "Meccan" },
  { n: 76, en: "Al-Insan", ar: "ٱلْإِنْسَان", verses: 31, loc: "Medinan" },
  { n: 77, en: "Al-Mursalat", ar: "ٱلْمُرْسَلَات", verses: 50, loc: "Meccan" },
  { n: 78, en: "An-Naba", ar: "ٱلنَّبَأ", verses: 40, loc: "Meccan" },
  { n: 79, en: "An-Nazi'at", ar: "ٱلنَّازِعَات", verses: 46, loc: "Meccan" },
  { n: 80, en: "Abasa", ar: "عَبَسَ", verses: 42, loc: "Meccan" },
  { n: 81, en: "At-Takwir", ar: "ٱلتَّكْوِير", verses: 29, loc: "Meccan" },
  { n: 82, en: "Al-Infitar", ar: "ٱلْإِنْفِطَار", verses: 19, loc: "Meccan" },
  { n: 83, en: "Al-Mutaffifin", ar: "ٱلْمُطَفِّفِين", verses: 36, loc: "Meccan" },
  { n: 84, en: "Al-Inshiqaq", ar: "ٱلْإِنْشِقَاق", verses: 25, loc: "Meccan" },
  { n: 85, en: "Al-Buruj", ar: "ٱلْبُرُوج", verses: 22, loc: "Meccan" },
  { n: 86, en: "At-Tariq", ar: "ٱلطَّارِق", verses: 17, loc: "Meccan" },
  { n: 87, en: "Al-A'la", ar: "ٱلْأَعْلَى", verses: 19, loc: "Meccan" },
  { n: 88, en: "Al-Ghashiyah", ar: "ٱلْغَاشِيَة", verses: 26, loc: "Meccan" },
  { n: 89, en: "Al-Fajr", ar: "ٱلْفَجْر", verses: 30, loc: "Meccan" },
  { n: 90, en: "Al-Balad", ar: "ٱلْبَلَد", verses: 20, loc: "Meccan" },
  { n: 91, en: "Ash-Shams", ar: "ٱلشَّمْس", verses: 15, loc: "Meccan" },
  { n: 92, en: "Al-Lail", ar: "ٱللَّيْل", verses: 21, loc: "Meccan" },
  { n: 93, en: "Ad-Duha", ar: "ٱلضُّحَى", verses: 11, loc: "Meccan" },
  { n: 94, en: "Ash-Sharh", ar: "ٱلشَّرْح", verses: 8, loc: "Meccan" },
  { n: 95, en: "At-Tin", ar: "ٱلتِّين", verses: 8, loc: "Meccan" },
  { n: 96, en: "Al-Alaq", ar: "ٱلْعَلَق", verses: 19, loc: "Meccan" },
  { n: 97, en: "Al-Qadr", ar: "ٱلْقَدْر", verses: 5, loc: "Meccan" },
  { n: 98, en: "Al-Bayyinah", ar: "ٱلْبَيِّنَة", verses: 8, loc: "Medinan" },
  { n: 99, en: "Az-Zalzalah", ar: "ٱلزَّلْزَلَة", verses: 8, loc: "Medinan" },
  { n: 100, en: "Al-Adiyat", ar: "ٱلْعَادِيَات", verses: 11, loc: "Meccan" },
  { n: 101, en: "Al-Qari'ah", ar: "ٱلْقَارِعَة", verses: 11, loc: "Meccan" },
  { n: 102, en: "At-Takathur", ar: "ٱلتَّكَاثُر", verses: 8, loc: "Meccan" },
  { n: 103, en: "Al-Asr", ar: "ٱلْعَصْر", verses: 3, loc: "Meccan" },
  { n: 104, en: "Al-Humazah", ar: "ٱلْهُمَزَة", verses: 9, loc: "Meccan" },
  { n: 105, en: "Al-Fil", ar: "ٱلْفِيل", verses: 5, loc: "Meccan" },
  { n: 106, en: "Quraish", ar: "قُرَيْش", verses: 4, loc: "Meccan" },
  { n: 107, en: "Al-Ma'un", ar: "ٱلْمَاعُون", verses: 7, loc: "Meccan" },
  { n: 108, en: "Al-Kawthar", ar: "ٱلْكَوْثَر", verses: 3, loc: "Meccan" },
  { n: 109, en: "Al-Kafirun", ar: "ٱلْكَافِرُون", verses: 6, loc: "Meccan" },
  { n: 110, en: "An-Nasr", ar: "ٱلنَّصْر", verses: 3, loc: "Medinan" },
  { n: 111, en: "Al-Masad", ar: "ٱلْمَسَد", verses: 5, loc: "Meccan" },
  { n: 112, en: "Al-Ikhlas", ar: "ٱلْإِخْلَاص", verses: 4, loc: "Meccan" },
  { n: 113, en: "Al-Falaq", ar: "ٱلْفَلَق", verses: 5, loc: "Meccan" },
  { n: 114, en: "An-Nas", ar: "ٱلنَّاس", verses: 6, loc: "Meccan" },
];

const JUZS = Array.from({ length: 30 }, (_, i) => ({
  n: i + 1,
  start: `Juz ${i + 1} starting verse`,
}));

export default function ReadQuranPage() {
  const [tab, setTab] = useState<"surah" | "juz">("surah");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurahs = SURAHS.filter((s) =>
    s.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ar.includes(searchQuery) ||
    s.n.toString() === searchQuery
  );

  const filteredJuzs = JUZS.filter((j) =>
    j.n.toString() === searchQuery ||
    `juz ${j.n}`.includes(searchQuery.toLowerCase())
  );

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
          <button
            onClick={() => setTab("surah")}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-full transition-all ${tab === "surah" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-black/5"}`}
          >
            Surah
          </button>
          <button
            onClick={() => setTab("juz")}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-full transition-all ${tab === "juz" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-black/5"}`}
          >
            Juz
          </button>
        </div>

        <div className="relative flex-1 w-full flex items-center gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surah, translation, or ayah..."
              className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 hover:border-primary/30 hover:shadow-md"
            />
          </div>

          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground group">
            <Settings2 className="h-5 w-5 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
        {tab === "surah" && filteredSurahs.map((s) => (
          <Link href={`/app/read/surah-${s.n}`} key={s.n} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]">
            {/* Number + EN Name */}
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {s.n}
              </div>
              <div className="min-w-0 pr-2">
                <h3 className="font-bold truncate group-hover:text-primary transition-colors text-sm md:text-base">{s.en}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.loc} • {s.verses} Verses</p>
              </div>
            </div>

            {/* AR Name */}
            <div className="text-right flex items-center justify-end shrink-0">
              <div className="text-xl md:text-2xl font-bold font-serif opacity-80 group-hover:opacity-100 group-hover:text-primary transition-all pr-2 truncate" dir="rtl">
                {s.ar}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}

        {tab === "juz" && filteredJuzs.map((j) => (
          <Link href={`/app/read/juz-${j.n}`} key={j.n} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {j.n}
              </div>
              <div>
                <h3 className="font-bold group-hover:text-primary transition-colors text-sm md:text-base">Juz {j.n}</h3>
              </div>
            </div>
            <div className="text-right flex items-center justify-end">
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}

        {((tab === "surah" && filteredSurahs.length === 0) || (tab === "juz" && filteredJuzs.length === 0)) && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center">
            <p className="text-muted-foreground">No matches found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
