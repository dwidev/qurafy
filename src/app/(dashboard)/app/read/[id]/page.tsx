"use client";

import { useState, Suspense } from "react";
import { ArrowLeft, Bookmark, PlayCircle, Settings, Share2, CheckCircle2, X, BookOpen, Menu } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

function ReaderContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const idStr = typeof params?.id === "string" ? params.id : "";
  const isKhatamMode = searchParams?.get("khatam") === "true";

  // Parse ID (e.g. "surah-1" or "juz-1")
  const type = idStr.split("-")[0];
  const number = idStr.split("-")[1] || "1";

  const title = type === "juz" ? `Juz ${number}` : `Surah ${number}`;
  const subtitle = type === "juz" ? "Khatam Reading" : "The Opener • 7 Verses";

  // --- Settings State ---
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    mode: "verse", // "verse" | "mushaf"
    showTranslation: true,
    showTransliteration: true,
    arabicSize: 4 // scale 1-7
  });

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleKhatamComplete = () => {
    const saved = localStorage.getItem("khatam_plan");
    if (saved) {
      try {
        const plan = JSON.parse(saved);
        const todayStr = new Date().toISOString().split("T")[0];
        if (!plan.completedDays.includes(todayStr)) {
          plan.completedDays.push(todayStr);
          localStorage.setItem("khatam_plan", JSON.stringify(plan));
        }
      } catch (err) {
        console.error("Failed to update khatam plan", err);
      }
    }
    router.push("/app/tracker");
  };

  // Mock dynamic data based on number
  const VERSES = [
    { n: 1, ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", en: "In the Name of Allah—the Most Compassionate, Most Merciful.", latin: "Bismillāhi r-raḥmāni r-raḥīm." },
    { n: 2, ar: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", en: "All praise is for Allah—Lord of all worlds,", latin: "Al-ḥamdu lillāhi rabbi l-ʿālamīn." },
    { n: 3, ar: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", en: "the Most Compassionate, Most Merciful,", latin: "Ar-raḥmāni r-raḥīm." },
    { n: 4, ar: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", en: "Master of the Day of Judgment.", latin: "Māliki yawmi d-dīn." },
    { n: 5, ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "You ˹alone˺ we worship and You ˹alone˺ we ask for help.", latin: "Iyyāka naʿbudu wa-iyyāka nastaʿīn." },
    { n: 6, ar: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", en: "Guide us along the Straight Path,", latin: "Ihdinā ṣ-ṣirāṭa l-mustaqīm." },
    { n: 7, ar: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", en: "the Path of those You have blessed—not those You are displeased with, or those who are astray.", latin: "Ṣirāṭa l-laḏīna anʿamta ʿalayhim ġayri l-maġḍūbi ʿalayhim walā ḍ-ḍāllīn." }
  ];

  // Helper for font sizes
  const arabicScale = ["text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl"];

  return (
    <div className="flex h-full flex-col relative pb-24 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold leading-tight capitalize">{title}</h1>
              {isKhatamMode && (
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  Daily Target
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-full p-2 transition-colors ${showSettings ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="sticky top-16 z-10 bg-card border-b border-border shadow-lg p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Reading Settings</h3>
            <button onClick={() => setShowSettings(false)} className="rounded-full p-1 hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reading Mode</label>
              <div className="flex bg-secondary p-1 rounded-xl">
                <button
                  onClick={() => updateSetting("mode", "verse")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${settings.mode === "verse" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Menu className="h-4 w-4" /> Verse by Verse
                </button>
                <button
                  onClick={() => updateSetting("mode", "mushaf")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${settings.mode === "mushaf" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <BookOpen className="h-4 w-4" /> Mushaf
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arabic Font Size</label>
                <span className="text-xs text-muted-foreground font-medium">{settings.arabicSize}/7</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={settings.arabicSize}
                onChange={(e) => updateSetting("arabicSize", Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary accent-primary"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visibility</label>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium">Translation</span>
                  <div className={`w-11 h-6 rounded-full transition-colors relative ${settings.showTranslation ? "bg-primary" : "bg-secondary"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showTranslation ? "left-6" : "left-1"}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={settings.showTranslation} onChange={(e) => updateSetting("showTranslation", e.target.checked)} />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium">Transliteration (Latin)</span>
                  <div className={`w-11 h-6 rounded-full transition-colors relative ${settings.showTransliteration ? "bg-primary" : "bg-secondary"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showTransliteration ? "left-6" : "left-1"}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={settings.showTransliteration} onChange={(e) => updateSetting("showTransliteration", e.target.checked)} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bismillah */}
      <div className="py-8 pt-10 text-center text-3xl font-serif text-foreground/90 font-bold border-b border-border/40 mb-2">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        {settings.mode === "verse" ? (
          <div className="space-y-6">
            {VERSES.map((verse) => (
              <div key={verse.n} className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {number}:{verse.n}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                      <PlayCircle className="h-4 w-4" />
                    </button>
                    <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className={`text-right font-serif leading-[2.5] mb-6 text-foreground/90 font-bold ${arabicScale[settings.arabicSize - 1]}`} dir="rtl">
                  {verse.ar}
                </div>

                {settings.showTransliteration && (
                  <div className="text-primary/80 font-medium tracking-wide mb-3 leading-relaxed text-sm">
                    {verse.latin}
                  </div>
                )}

                {settings.showTranslation && (
                  <div className="text-lg text-muted-foreground leading-relaxed">
                    {verse.en}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card p-8 md:p-12 shadow-sm">
            <div className={`text-right font-serif leading-[2.6] text-foreground/90 font-bold ${arabicScale[settings.arabicSize - 1]}`} dir="rtl">
              {VERSES.map((verse) => (
                <span key={verse.n} className="inline mr-2">
                  {verse.ar} <span className="inline-flex items-center justify-center translate-y-2.5 mx-1 relative"><span className="absolute inset-0 flex items-center justify-center text-[0.4em] translate-y-[-8px] text-muted-foreground">{verse.n}</span><span className="text-primary/70 text-[0.8em]">۝</span></span>
                </span>
              ))}
            </div>

            {(settings.showTransliteration || settings.showTranslation) && (
              <div className="mt-12 pt-8 border-t border-border/50 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Translations</h4>
                {VERSES.map((verse) => (
                  <div key={verse.n} className="flex gap-4">
                    <span className="text-xs font-bold text-primary mt-1 min-w-[32px]">{number}:{verse.n}</span>
                    <div>
                      {settings.showTransliteration && <p className="text-sm text-primary/80 font-medium mb-1">{verse.latin}</p>}
                      {settings.showTranslation && <p className="text-muted-foreground">{verse.en}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Khatam Completion Action Box */}
        {isKhatamMode && (
          <div className="mt-12 rounded-3xl bg-primary/5 border border-primary/20 p-6 md:p-8 flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center shrink-0 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Finished Today&apos;s Reading?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Mark this Juz as complete to update your Khatam Planner streak.
            </p>
            <button
              onClick={handleKhatamComplete}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90 active:scale-95 transition-all text-sm"
            >
              Mark Completed & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SurahReaderPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center pt-20"><div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin" /></div>}>
      <ReaderContent />
    </Suspense>
  );
}
