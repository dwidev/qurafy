import type {
  AppearanceSettings,
  NotificationSettings,
  ReadingSettings,
} from "@/features/settings/types";

export const defaultNotificationSettings: NotificationSettings = {
  readingReminders: true,
  hifzRepetitions: true,
  khatamDaily: true,
  marketing: false,
};

export const defaultReadingSettings: ReadingSettings = {
  mode: "verse",
  showTranslation: true,
  showTransliteration: true,
  arabicSize: 4,
};

export const defaultAppearanceSettings: AppearanceSettings = {
  theme: "system",
  mushafMode: false,
  fontSize: 4,
};

export const settingsStorageKey = "qurafy-user-settings";
