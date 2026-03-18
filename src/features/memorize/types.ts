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

export type MemorizeDeletedGoalHistory = {
  id: string;
  historyState: "deleted" | "completed";
  title: string;
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  totalVerses: number;
  targetDays: number;
  repsPerVerse: number;
  status: "active" | "completed";
  completedDays: number;
  completedVerses: number;
  progressPct: number;
  currentStreak: number;
  bestStreak: number;
  deletedAt: string | null;
  expiresAt: string | null;
  completedAt: string | null;
};

export type MemorizeMeData = {
  surahs: MemorizeSurahOption[];
  activeGoal: MemorizeActiveGoal | null;
  deletedGoalHistory: MemorizeDeletedGoalHistory[];
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

export type UpdateMemorizeGoalPayload = {
  goalId: string;
  targetDays: number;
  repsPerVerse: number;
};

export type CompleteMemorizeSessionPayload = {
  goalId: string;
  dayNumber: number;
};

export type RecreateMemorizeGoalPayload = {
  historyId: string;
};
