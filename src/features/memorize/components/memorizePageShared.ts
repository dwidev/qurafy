"use client";

import type { LucideIcon } from "lucide-react";

export const DEFAULT_SURAHS = [
  { n: 1, en: "Al-Fatihah", ar: "ٱلْفَاتِحَة", verses: 7 },
  { n: 78, en: "An-Naba", ar: "ٱلنَّبَإِ", verses: 40 },
  { n: 79, en: "An-Nazi'at", ar: "ٱلنَّٰزِعَٰت", verses: 46 },
  { n: 80, en: "Abasa", ar: "عَبَسَ", verses: 42 },
];

export const DEFAULT_TODAY_VERSES = [
  { n: 1, ar: "عَمَّ يَتَسَآءَلُونَ", tr: "What are they asking one another about?" },
  { n: 2, ar: "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ", tr: "About the great news —" },
  { n: 3, ar: "ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ", tr: "that over which they are in disagreement." },
  { n: 4, ar: "كَلَّا سَيَعْلَمُونَ", tr: "No! They are going to know." },
  { n: 5, ar: "ثُمَّ كَلَّا سَيَعْلَمُونَ", tr: "Then, no! They are going to know." },
];

export const DEFAULT_UPCOMING = [
  { day: "Day 9 · Tomorrow", range: "An-Naba, Verses 11–20", count: 10 },
  { day: "Day 10 · Thu", range: "An-Naba, Verses 21–30", count: 10 },
  { day: "Day 11 · Fri", range: "An-Naba, Verses 31–40", count: 10 },
];

export const MEMORIZE_SESSION_DONE_STORAGE_KEY = "memorize.session.done";

export type MemorizeSessionDoneMarker = {
  dateKey: string;
  goalId: string;
  dayNumber: number;
};

export type MemorizeGoalForm = {
  title: string;
  surahIdx: number;
  days: number;
  reps: number;
};

export type MemorizeHeaderProps = {
  hasActiveGoal: boolean;
  onOpenSettings: () => void;
};

export type MemorizeStatItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bg: string;
};

export type GoalPreview = {
  title: string;
  surah: string;
  totalDays: number;
  passedDays: number;
  totalVerses: number;
  doneVerses: number;
};

export type ActiveGoalCardProps = {
  goal: GoalPreview;
  selectedSurahName: string;
  pct: number;
  remainingDays: number;
};

export type TodayTargetSectionProps = {
  showCompletionCard: boolean;
  hasTodayTarget: boolean;
  surahName: string;
  startVerse: number;
  endVerse: number;
  versesCount: number;
  targetReps: number;
  todayLabel: string;
  onStartSession: () => void;
};

export type MemorizeSurah = { n: number; en: string; verses: number };

export function buildRangeLabel(surahName: string, startVerse: number, endVerse: number) {
  if (startVerse === endVerse) {
    return `${surahName}, Verse ${startVerse}`;
  }

  return `${surahName}, Verses ${startVerse}-${endVerse}`;
}

export function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLocalDateLabel(input = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(input);
}

export function readMemorizeSessionDoneMarker(): MemorizeSessionDoneMarker | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as MemorizeSessionDoneMarker;

    if (!parsed?.goalId || !parsed?.dateKey || !Number.isInteger(parsed?.dayNumber)) {
      window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
      return null;
    }

    if (parsed.dateKey !== getLocalDateKey()) {
      window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
    return null;
  }
}

export function clearMemorizeSessionDoneMarker() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MEMORIZE_SESSION_DONE_STORAGE_KEY);
}
