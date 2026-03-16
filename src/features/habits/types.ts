export const HABIT_CATEGORIES = [
  "Prayer",
  "Quran",
  "Health",
  "Learning",
  "Mindfulness",
  "Lifestyle",
  "Other",
] as const;

export const HABIT_ROUTINES = ["morning", "afternoon", "evening", "anytime"] as const;
export const HABIT_TYPES = ["boolean", "quantitative"] as const;
export const HABIT_COLORS = ["emerald", "amber", "rose", "blue", "indigo"] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
export type HabitRoutine = (typeof HABIT_ROUTINES)[number];
export type HabitType = (typeof HABIT_TYPES)[number];
export type HabitColor = (typeof HABIT_COLORS)[number];

export type HabitDayPoint = {
  date: string;
  value: number;
  target: number;
  isCompleted: boolean;
  isToday: boolean;
};

export type HabitRecord = {
  id: string;
  title: string;
  category: string;
  color: HabitColor;
  iconName: string | null;
  type: HabitType;
  routine: HabitRoutine;
  target: number;
  unit: string | null;
  createdAt: string;
  updatedAt: string;
  todayValue: number;
  isCompletedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  totalCheckIns: number;
  completionRate7d: number;
  week: HabitDayPoint[];
};

export type HabitSummary = {
  totalHabits: number;
  completedToday: number;
  completionRateToday: number;
  currentStreak: number;
  bestStreak: number;
  totalCheckIns: number;
  consistencyScore: number;
};

export type HabitSuggestion = {
  label: string;
  category: string;
  routine: HabitRoutine;
  type: HabitType;
  target: number;
  unit: string | null;
  color: HabitColor;
};

export type HabitMeData = {
  isAvailable: boolean;
  summary: HabitSummary;
  habits: HabitRecord[];
  categories: string[];
  suggestions: HabitSuggestion[];
};

export type SaveHabitPayload = {
  title: string;
  category: string;
  color: HabitColor;
  type: HabitType;
  routine: HabitRoutine;
  target?: number;
  unit?: string | null;
  iconName?: string | null;
};

export type UpdateHabitPayload = SaveHabitPayload & {
  habitId: string;
};

export type DeleteHabitPayload = {
  habitId: string;
};

export type UpsertHabitEntryPayload = {
  habitId: string;
  date?: string;
  value: number;
};
