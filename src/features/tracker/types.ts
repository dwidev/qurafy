export type KhatamDailyTarget = {
  dayNumber: number;
  date: string;
  startSurahNumber: number;
  startSurahName: string;
  startVerse: number;
  endSurahNumber: number;
  endSurahName: string;
  endVerse: number;
  versesCount: number;
  rangeLabel: string;
  surahLabel: string;
  readId: string;
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
};

export type KhatamActivePlan = {
  id: string;
  name: string;
  startJuz: number;
  startDate: string;
  targetDate: string;
  completedDays: string[];
  currentStreak: number;
  bestStreak: number;
  totalVerses: number;
  totalDays: number;
  dailyTargets: KhatamDailyTarget[];
};

export type KhatamMeData = {
  activePlan: KhatamActivePlan | null;
};

export type CreateKhatamPlanPayload = {
  name: string;
  startJuz: number;
  targetDate: string;
};

export type UpdateKhatamPlanPayload = {
  planId: string;
  name: string;
  targetDate: string;
};

export type DeleteKhatamPlanPayload = {
  planId: string;
};

export type ToggleKhatamDayPayload = {
  planId: string;
  scheduledDate?: string;
  forceDone?: boolean;
};
