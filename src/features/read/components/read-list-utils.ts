"use client";

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
