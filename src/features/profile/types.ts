export type DailyGoalValue =
  | "build-consistency"
  | "memorize-juz-amma"
  | "finish-khatam"
  | "learn-tafsir";

export type ProfileMeData = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  profile: {
    username: string;
    location: string;
    bio: string;
    dailyGoal: DailyGoalValue;
    createdAt: string;
    updatedAt: string;
  } | null;
  stats: ProfileStats;
};

export type ProfileStats = {
  completedKhatam: number;
  activeGoals: number;
  completedVerses: number;
  totalVersesRead: number;
  currentStreak: number;
  bestStreak: number;
  rank: string;
};

export type CompleteProfilePayload = {
  fullName: string;
  username: string;
  location: string;
  bio: string;
  dailyGoal: DailyGoalValue;
};
