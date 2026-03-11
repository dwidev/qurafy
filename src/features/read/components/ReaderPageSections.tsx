"use client";

import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Menu,
  PlayCircle,
  Settings,
  Share2,
  X,
} from "lucide-react";
import type { QuranVerse, ReadContentData } from "@/features/read/types";

export type ReaderSettings = {
  mode: "verse" | "mushaf";
  showTranslation: boolean;
  showTransliteration: boolean;
  arabicSize: number;
};

type ReaderFeedbackStateProps = {
  title: string;
  message: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

type ReaderHeaderProps = {
  title: string;
  subtitle: string;
  isKhatamMode: boolean;
  showSettings: boolean;
  onBack: () => void;
  onToggleSettings: () => void;
};

type ReaderSettingsPanelProps = {
  settings: ReaderSettings;
  onClose: () => void;
  onUpdate: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
};

type ReaderBodyProps = {
  data: ReadContentData;
  arabicScaleClass: string;
  settings: ReaderSettings;
};

type KhatamCompletionCardProps = {
  isPending: boolean;
  error: string | null;
  onComplete: () => void;
};

function ReaderToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm font-medium">{label}</span>
      <div className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary"}`}>
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-6" : "left-1"}`}
        />
      </div>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

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

export function ReaderFeedbackState({
  title,
  message,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ReaderFeedbackStateProps) {
  return (
    <div className="mx-auto max-w-3xl flex-1 p-4 pb-24 pt-6 md:p-8">
      <div className="space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-black">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            {primaryActionLabel}
          </button>
          {secondaryActionLabel && onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
            >
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ReaderHeader({
  title,
  subtitle,
  isKhatamMode,
  showSettings,
  onBack,
  onToggleSettings,
}: ReaderHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="rounded-full p-2 transition-colors hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold capitalize leading-tight">{title}</h1>
            {isKhatamMode ? (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                Daily Target
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onToggleSettings}
        className={`rounded-full p-2 transition-colors ${showSettings ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}

export function ReaderSettingsPanel({ settings, onClose, onUpdate }: ReaderSettingsPanelProps) {
  return (
    <div className="sticky top-16 z-10 flex flex-col gap-6 border-b border-border bg-card p-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Reading Settings</h3>
        <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reading Mode</label>
          <div className="flex rounded-xl bg-secondary p-1">
            <button
              onClick={() => onUpdate("mode", "verse")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${settings.mode === "verse" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Menu className="h-4 w-4" /> Verse by Verse
            </button>
            <button
              onClick={() => onUpdate("mode", "mushaf")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${settings.mode === "mushaf" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <BookOpen className="h-4 w-4" /> Mushaf
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arabic Font Size</label>
            <span className="text-xs font-medium text-muted-foreground">{settings.arabicSize}/7</span>
          </div>
          <input
            type="range"
            min="1"
            max="7"
            value={settings.arabicSize}
            onChange={(event) => onUpdate("arabicSize", Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visibility</label>
          <div className="space-y-3">
            <ReaderToggle
              checked={settings.showTranslation}
              label="Translation"
              onChange={(checked) => onUpdate("showTranslation", checked)}
            />
            <ReaderToggle
              checked={settings.showTransliteration}
              label="Transliteration (Latin)"
              onChange={(checked) => onUpdate("showTransliteration", checked)}
            />
          </div>
        </div>
      </div>
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

export function KhatamCompletionCard({ isPending, error, onComplete }: KhatamCompletionCardProps) {
  return (
    <div className="mx-auto mt-12 flex max-w-lg flex-col items-center rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center md:p-8">
      <div className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-bold">Finished Today&apos;s Reading?</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Mark this verse target as complete to update your Khatam Planner progress.
      </p>
      <button
        onClick={onComplete}
        disabled={isPending}
        className="h-12 w-full rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
      >
        {isPending ? "Marking..." : "Mark Completed & Return"}
      </button>
      {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
