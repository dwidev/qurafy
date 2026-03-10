import type { QuranVerse } from "@/features/read/types";

export type MemorizeSurahOption = {
  n: number;
  en: string;
  ar: string;
  verses: number;
};

export type MemorizeTodayTarget = {
  dayNumber: number;
  startVerse: number;
  endVerse: number;
  verses: QuranVerse[];
  isCompleted: boolean;
};

export type MemorizeUpcomingTarget = {
  dayLabel: string;
  rangeLabel: string;
  count: number;
};

export type MemorizeActiveGoal = {
  id: string;
  title: string;
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  targetDays: number;
  repsPerVerse: number;
  totalVerses: number;
  completedVerses: number;
  progressPct: number;
  passedDays: number;
  remainingDays: number;
  dailyTargetCount: number;
  currentStreak: number;
  bestStreak: number;
  todayTarget: MemorizeTodayTarget | null;
  upcomingTargets: MemorizeUpcomingTarget[];
};

export type MemorizeMeData = {
  surahs: MemorizeSurahOption[];
  activeGoal: MemorizeActiveGoal | null;
};

export type CreateMemorizeGoalPayload = {
  title: string;
  surahNumber: number;
  targetDays: number;
  repsPerVerse: number;
};

export type DeleteMemorizeGoalPayload = {
  goalId: string;
};

export type CompleteMemorizeSessionPayload = {
  goalId: string;
  dayNumber: number;
};
