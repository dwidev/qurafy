"use client";

import { useState } from "react";
import {
  AccountSettingsSection,
  AppearanceSettingsSection,
  type AppearanceSettings,
  GeneralSettingsSection,
  NotificationSettingsSection,
  type NotificationSettings,
  PlaceholderSettingsSection,
  SettingsHeader,
  SettingsSidebar,
  type SettingsTab,
} from "@/features/settings/components/SettingsPageSections";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [notifications, setNotifications] = useState<NotificationSettings>({
    readingReminders: true,
    hifzRepetitions: true,
    khatamDaily: true,
    marketing: false,
  });
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
    mushafMode: true,
    fontSize: 4,
  });

  const updateNotify = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-32 pt-6 md:p-8">
      <SettingsHeader />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="animate-in space-y-8 fade-in slide-in-from-right-4 duration-500">
          {activeTab === "general" ? <GeneralSettingsSection /> : null}
          {activeTab === "account" ? <AccountSettingsSection /> : null}
          {activeTab === "notifications" ? (
            <NotificationSettingsSection notifications={notifications} onToggle={updateNotify} />
          ) : null}
          {activeTab === "appearance" ? (
            <AppearanceSettingsSection
              appearance={appearance}
              onThemeChange={(theme) => setAppearance((prev) => ({ ...prev, theme }))}
              onToggleMushafMode={() => setAppearance((prev) => ({ ...prev, mushafMode: !prev.mushafMode }))}
            />
          ) : null}
          {["reading", "security", "billing"].includes(activeTab) ? (
            <PlaceholderSettingsSection activeTab={activeTab} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
