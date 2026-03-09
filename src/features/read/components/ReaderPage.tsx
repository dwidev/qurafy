"use client";

import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  PlayCircle,
  Settings,
  Share2,
  CheckCircle2,
  X,
  BookOpen,
  Menu,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getReadErrorMessage,
  isUnauthorizedReadError,
  useReadContentQuery,
} from "@/features/read/api/client";
import { ReaderPageSkeleton } from "@/features/read/components/ReaderPageSkeleton";
import { getKhatamErrorMessage, useToggleKhatamDayMutation } from "@/features/tracker/api/client";

function ReaderContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const idStr = typeof params?.id === "string" ? params.id : "";
  const isKhatamMode = searchParams?.get("khatam") === "true";
  const khatamPlanId = searchParams?.get("planId") ?? "";
  const scheduledDate = searchParams?.get("scheduledDate") ?? "";
  const returnTo = searchParams?.get("returnTo") ?? "/app/tracker";
  const { data, isLoading, isError, error, refetch } = useReadContentQuery(idStr);
  const toggleKhatamDayMutation = useToggleKhatamDayMutation();

  const [showSettings, setShowSettings] = useState(false);
  const [khatamCompleteError, setKhatamCompleteError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    mode: "verse",
    showTranslation: true,
    showTransliteration: true,
    arabicSize: 4,
  });

  useEffect(() => {
    if (error && isUnauthorizedReadError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleKhatamComplete = async () => {
    setKhatamCompleteError(null);

    if (!khatamPlanId) {
      setKhatamCompleteError("Missing khatam plan context. Please return to tracker and continue from there.");
      return;
    }

    try {
      await toggleKhatamDayMutation.mutateAsync({
        planId: khatamPlanId,
        scheduledDate: scheduledDate || undefined,
        forceDone: true,
      });
      router.push(returnTo);
    } catch (caughtError) {
      setKhatamCompleteError(getKhatamErrorMessage(caughtError));
    }
  };

  const arabicScale = ["text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl"];

  if (!idStr) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h2 className="text-lg font-black">Invalid read content</h2>
          <p className="text-sm text-muted-foreground">The requested Quran reference is missing.</p>
          <button
            type="button"
            onClick={() => router.push("/app/read")}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
          >
            Back to Read
          </button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h2 className="text-lg font-black">Could not load Quran content</h2>
          <p className="text-sm text-muted-foreground">{getReadErrorMessage(error)}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => router.push("/app/read")}
              className="h-10 px-4 rounded-lg border border-border bg-background text-sm font-bold hover:bg-muted"
            >
              Back to Read
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <ReaderPageSkeleton />;
  }

  return (
    <div className="flex h-full flex-col relative pb-24 md:pb-6">
      <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold leading-tight capitalize">{data.title}</h1>
              {isKhatamMode && (
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  Daily Target
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{data.subtitle}</p>
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

      {showSettings && (
        <div className="sticky top-16 z-10 bg-card border-b border-border shadow-lg p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Reading Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="rounded-full p-1 hover:bg-muted text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reading Mode
              </label>
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
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Arabic Font Size
                </label>
                <span className="text-xs text-muted-foreground font-medium">{settings.arabicSize}/7</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={settings.arabicSize}
                onChange={(event) => updateSetting("arabicSize", Number(event.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary accent-primary"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium">Translation</span>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative ${settings.showTranslation ? "bg-primary" : "bg-secondary"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showTranslation ? "left-6" : "left-1"}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={settings.showTranslation}
                    onChange={(event) => updateSetting("showTranslation", event.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium">Transliteration (Latin)</span>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative ${settings.showTransliteration ? "bg-primary" : "bg-secondary"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showTransliteration ? "left-6" : "left-1"}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={settings.showTransliteration}
                    onChange={(event) => updateSetting("showTransliteration", event.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.bismillah ? (
        <div className="py-8 pt-10 text-center text-3xl font-serif text-foreground/90 font-bold border-b border-border/40 mb-2">
          {data.bismillah}
        </div>
      ) : null}

      <div className="flex-1 overflow-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        {settings.mode === "verse" ? (
          <div className="space-y-6">
            {data.verses.map((verse) => (
              <div
                key={verse.key}
                className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {verse.key}
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

                <div
                  className={`text-right font-serif leading-[2.5] mb-6 text-foreground/90 font-bold ${arabicScale[settings.arabicSize - 1]}`}
                  dir="rtl"
                >
                  {verse.ar}
                </div>

                {settings.showTransliteration && (
                  <div className="text-primary/80 font-medium tracking-wide mb-3 leading-relaxed text-sm">
                    {verse.latin}
                  </div>
                )}

                {settings.showTranslation && (
                  <div className="text-lg text-muted-foreground leading-relaxed">{verse.en}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card p-8 md:p-12 shadow-sm">
            <div
              className={`text-right font-serif leading-[2.6] text-foreground/90 font-bold ${arabicScale[settings.arabicSize - 1]}`}
              dir="rtl"
            >
              {data.verses.map((verse) => (
                <span key={verse.key} className="inline mr-2">
                  {verse.ar}{" "}
                  <span className="inline-flex items-center justify-center translate-y-2.5 mx-1 relative">
                    <span className="absolute inset-0 flex items-center justify-center text-[0.4em] translate-y-[-8px] text-muted-foreground">
                      {verse.n}
                    </span>
                    <span className="text-primary/70 text-[0.8em]">۝</span>
                  </span>
                </span>
              ))}
            </div>

            {(settings.showTransliteration || settings.showTranslation) && (
              <div className="mt-12 pt-8 border-t border-border/50 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Translations
                </h4>
                {data.verses.map((verse) => (
                  <div key={verse.key} className="flex gap-4">
                    <span className="text-xs font-bold text-primary mt-1 min-w-[32px]">
                      {verse.key}
                    </span>
                    <div>
                      {settings.showTransliteration && (
                        <p className="text-sm text-primary/80 font-medium mb-1">{verse.latin}</p>
                      )}
                      {settings.showTranslation && <p className="text-muted-foreground">{verse.en}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isKhatamMode && (
          <div className="mt-12 rounded-3xl bg-primary/5 border border-primary/20 p-6 md:p-8 flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center shrink-0 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Finished Today&apos;s Reading?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Mark this verse target as complete to update your Khatam Planner progress.
            </p>
            <button
              onClick={() => {
                void handleKhatamComplete();
              }}
              disabled={toggleKhatamDayMutation.isPending}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90 active:scale-95 transition-all text-sm"
            >
              {toggleKhatamDayMutation.isPending ? "Marking..." : "Mark Completed & Return"}
            </button>
            {khatamCompleteError && (
              <p className="mt-3 text-xs text-destructive">{khatamCompleteError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SurahReaderPage() {
  return (
    <Suspense fallback={<ReaderPageSkeleton />}>
      <ReaderContent />
    </Suspense>
  );
}
