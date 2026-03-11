"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Search, Settings2 } from "lucide-react";
import { PageFeedback } from "@/components/ui/page-feedback";
import type { QuranJuzSummary, QuranSurahSummary } from "@/features/read/types";

export type ReadListTab = "surah" | "juz";

export function filterSurahs(surahs: QuranSurahSummary[], searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return surahs.filter((surah) => {
    return (
      surah.en.toLowerCase().includes(normalizedQuery) ||
      surah.ar.includes(searchQuery) ||
      surah.n.toString() === searchQuery.trim()
    );
  });
}

export function filterJuzs(juzs: QuranJuzSummary[], searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return juzs.filter((juz) => {
    if (juz.n.toString() === searchQuery.trim()) {
      return true;
    }

    return `juz ${juz.n}`.includes(normalizedQuery);
  });
}

export function ReadListErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <PageFeedback
      title="Could not load Quran list"
      message={message}
      tone="error"
      actions={[{ label: "Retry", onClick: onRetry }]}
    />
  );
}

export function ReadPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </span>
          Read Quran
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Explore and read the Holy Quran.</p>
      </div>
    </div>
  );
}

export function ReadToolbar({
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
}: {
  activeTab: ReadListTab;
  searchQuery: string;
  onTabChange: (tab: ReadListTab) => void;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="sticky top-0 z-10 mx-1 flex flex-col items-center gap-4 rounded-2xl bg-background/95 py-4 pb-2 pt-4 backdrop-blur-md md:flex-row">
      <div className="flex w-full items-center rounded-full bg-secondary p-1 shadow-sm md:w-auto">
        <ReadToolbarTab label="Surah" isActive={activeTab === "surah"} onClick={() => onTabChange("surah")} />
        <ReadToolbarTab label="Juz" isActive={activeTab === "juz"} onClick={() => onTabChange("juz")} />
      </div>

      <div className="relative flex w-full flex-1 items-center gap-3">
        <div className="group relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search surah, translation, or ayah..."
            className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/30 hover:shadow-md"
          />
        </div>

        <button className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-muted hover:text-foreground">
          <Settings2 className="h-5 w-5 transition-colors group-hover:text-primary" />
        </button>
      </div>
    </div>
  );
}

function ReadToolbarTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-6 py-2 text-sm transition-all md:flex-none ${
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
      } ${label === "Surah" ? "font-semibold" : "font-medium"}`}
    >
      {label}
    </button>
  );
}

export function ReadListGrid({
  activeTab,
  surahs,
  juzs,
}: {
  activeTab: ReadListTab;
  surahs: QuranSurahSummary[];
  juzs: QuranJuzSummary[];
}) {
  if (activeTab === "surah") {
    return (
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {surahs.map((surah) => (
          <ReadSurahCard key={surah.n} surah={surah} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
      {juzs.map((juz) => (
        <ReadJuzCard key={juz.n} juz={juz} />
      ))}
    </div>
  );
}

function ReadSurahCard({ surah }: { surah: QuranSurahSummary }) {
  return (
    <Link
      href={`/app/read/surah-${surah.n}`}
      className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          {surah.n}
        </div>
        <div className="min-w-0 pr-2">
          <h3 className="truncate text-sm font-bold transition-colors group-hover:text-primary md:text-base">
            {surah.en}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {surah.loc} • {surah.verses} Verses
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end text-right">
        <div
          className="truncate pr-2 font-serif text-xl font-bold opacity-80 transition-all group-hover:text-primary group-hover:opacity-100 md:text-2xl"
          dir="rtl"
        >
          {surah.ar}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function ReadJuzCard({ juz }: { juz: QuranJuzSummary }) {
  return (
    <Link
      href={`/app/read/juz-${juz.n}`}
      className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          {juz.n}
        </div>
        <div>
          <h3 className="text-sm font-bold transition-colors group-hover:text-primary md:text-base">Juz {juz.n}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{juz.start}</p>
        </div>
      </div>

      <div className="flex items-center justify-end text-right">
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
      </div>
    </Link>
  );
}

export function ReadListEmptyState({
  activeTab,
  searchQuery,
}: {
  activeTab: ReadListTab;
  searchQuery: string;
}) {
  return (
    <div className="py-20 text-center">
      <p className="text-muted-foreground">
        No {activeTab === "surah" ? "surahs" : "juz"} matched &quot;{searchQuery}&quot;.
      </p>
    </div>
  );
}
