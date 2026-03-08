import type { ReadingData, RecentActivityItem } from "@/types";

export type DashboardQuickStats = {
  streakDays: number;
  timeReadLabel: string;
  versesRead: number;
  weeklyGoalPct: number;
};

export type DashboardProgressCard = {
  title: string;
  subtitle: string;
  progressPct: number;
  targetLabel: string;
  statusLabel: string;
  stateLabel?: string;
};

export type DashboardDateInfo = {
  gregorian: string;
  hijri: string;
};

export type DashboardVerseQuote = {
  arabic: string;
  translation: string;
  reference: string;
};

export type DashboardViewData = {
  isNewUser: boolean;
  dateInfo: DashboardDateInfo;
  dailyVerse: DashboardVerseQuote;
  quickStats: DashboardQuickStats;
  readingQuranData: ReadingData | null;
  khatamProgressData: ReadingData | null;
  memorizationCard: DashboardProgressCard | null;
  khatamCard: DashboardProgressCard | null;
  recentItems: RecentActivityItem[];
};

export type DashboardMeData = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  dashboard: DashboardViewData;
};
