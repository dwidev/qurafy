"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReadListTab } from "@/features/read/components/read-list-utils";
import type { QuranJuzSummary, QuranSurahSummary } from "@/features/read/types";

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
