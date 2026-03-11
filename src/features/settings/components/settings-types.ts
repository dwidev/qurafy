"use client";

export type SettingsTab = "general" | "account" | "appearance" | "notifications" | "reading" | "security" | "billing";

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
