import type { DailyGoalValue } from "@/features/profile/types";

export type SettingsTab =
  | "general"
  | "account"
  | "appearance"
  | "notifications"
  | "reading"
  | "security"
  | "subscription"
  | "billing";

export type NotificationSettings = {
  readingReminders: boolean;
  hifzRepetitions: boolean;
  khatamDaily: boolean;
  marketing: boolean;
};

export type AppearanceSettings = {
  theme: "light" | "dark" | "system";
  mushafMode: boolean;
  fontSize: number;
};

export type ReadingSettings = {
  mode: "verse" | "mushaf";
  showTranslation: boolean;
  showTransliteration: boolean;
  arabicSize: number;
};

export type SettingsAccountData = {
  fullName: string;
  email: string;
  username: string;
  location: string;
  bio: string;
  dailyGoal: DailyGoalValue;
  emailVerified: boolean;
  memberSince: string;
};

export type SettingsSecuritySession = {
  id: string;
  isCurrent: boolean;
  userAgent: string | null;
  ipAddress: string | null;
  lastSeenAt: string;
  expiresAt: string;
};

export type SettingsBillingItem = {
  id: string;
  amount: number;
  type: "recurring" | "one_time";
  billingCycle: "monthly" | "yearly" | null;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
};

export type SettingsSubscriptionSummary = {
  id: string | null;
  transactionId: string | null;
  planType: "free" | "pro";
  status: "inactive" | "pending" | "active" | "canceled";
  billingCycle: "monthly" | "yearly" | null;
  amount: number | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export type SettingsBillingSummary = {
  donations: SettingsBillingItem[];
  totalConfirmedAmount: number;
  totalConfirmedCount: number;
  activeSupporter: boolean;
};

export type SettingsPageData = {
  appVersion: string;
  account: SettingsAccountData;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  reading: ReadingSettings;
  security: {
    sessions: SettingsSecuritySession[];
  };
  subscription: SettingsSubscriptionSummary;
  billing: SettingsBillingSummary;
};
