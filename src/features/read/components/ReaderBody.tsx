"use client";

import { Bookmark, PlayCircle, Share2 } from "lucide-react";
import type { ReaderSettings } from "@/features/read/components/reader-settings";
import type { QuranVerse, ReadContentData } from "@/features/read/types";

type ReaderBodyProps = {
  data: ReadContentData;
  arabicScaleClass: string;
  settings: ReaderSettings;
};

function VerseActions() {
  return (
    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
      <button className="rounded-full p-2 transition-colors hover:bg-muted hover:text-primary">
        <PlayCircle className="h-4 w-4" />
      </button>
      <button className="rounded-full p-2 transition-colors hover:bg-muted hover:text-primary">
        <Share2 className="h-4 w-4" />
      </button>
      <button className="rounded-full p-2 transition-colors hover:bg-muted hover:text-primary">
        <Bookmark className="h-4 w-4" />
      </button>
    </div>
  );
}

function VerseCard({
  verse,
  arabicScaleClass,
  showTranslation,
  showTransliteration,
}: {
  verse: QuranVerse;
  arabicScaleClass: string;
  showTranslation: boolean;
  showTransliteration: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {verse.key}
        </div>
        <VerseActions />
      </div>

      <div className={`mb-6 text-right font-serif font-bold leading-[2.5] text-foreground/90 ${arabicScaleClass}`} dir="rtl">
        {verse.ar}
      </div>

      {showTransliteration && (
        <div className="mb-3 text-sm font-medium leading-relaxed tracking-wide text-primary/80">{verse.latin}</div>
      )}

      {showTranslation && <div className="text-lg leading-relaxed text-muted-foreground">{verse.en}</div>}
    </div>
  );
}

function VerseList({ data, arabicScaleClass, settings }: ReaderBodyProps) {
  return (
    <div className="space-y-6">
      {data.verses.map((verse) => (
        <VerseCard
          key={verse.key}
          verse={verse}
          arabicScaleClass={arabicScaleClass}
          showTranslation={settings.showTranslation}
          showTransliteration={settings.showTransliteration}
        />
      ))}
    </div>
  );
}

function MushafTranslationList({
  verses,
  showTranslation,
  showTransliteration,
}: {
  verses: QuranVerse[];
  showTranslation: boolean;
  showTransliteration: boolean;
}) {
  if (!showTranslation && !showTransliteration) {
    return null;
  }

  return (
    <div className="mt-12 space-y-6 border-t border-border/50 pt-8">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Translations</h4>
      {verses.map((verse) => (
        <div key={verse.key} className="flex gap-4">
          <span className="mt-1 min-w-[32px] text-xs font-bold text-primary">{verse.key}</span>
          <div>
            {showTransliteration && <p className="mb-1 text-sm font-medium text-primary/80">{verse.latin}</p>}
            {showTranslation && <p className="text-muted-foreground">{verse.en}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function MushafView({ data, arabicScaleClass, settings }: ReaderBodyProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm md:p-12">
      <div className={`text-right font-serif font-bold leading-[2.6] text-foreground/90 ${arabicScaleClass}`} dir="rtl">
        {data.verses.map((verse) => (
          <span key={verse.key} className="mr-2 inline">
            {verse.ar}{" "}
            <span className="relative mx-1 inline-flex translate-y-2.5 items-center justify-center">
              <span className="absolute inset-0 flex translate-y-[-8px] items-center justify-center text-[0.4em] text-muted-foreground">
                {verse.n}
              </span>
              <span className="text-[0.8em] text-primary/70">۝</span>
            </span>
          </span>
        ))}
      </div>
      <MushafTranslationList
        verses={data.verses}
        showTranslation={settings.showTranslation}
        showTransliteration={settings.showTransliteration}
      />
    </div>
  );
}

export function ReaderBody({ data, arabicScaleClass, settings }: ReaderBodyProps) {
  return settings.mode === "verse" ? (
    <VerseList data={data} arabicScaleClass={arabicScaleClass} settings={settings} />
  ) : (
    <MushafView data={data} arabicScaleClass={arabicScaleClass} settings={settings} />
  );
}
