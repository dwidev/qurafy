"use client";

import { SettingsCard } from "@/features/settings/components/SettingsCard";
import { SettingsToggle } from "@/features/settings/components/SettingsToggle";
import type { NotificationSettings } from "@/features/settings/components/settings-types";

export function NotificationSettingsSection({
  notifications,
  onToggle,
}: {
  notifications: NotificationSettings;
  onToggle: (key: keyof NotificationSettings) => void;
}) {
  return (
    <SettingsCard title="Notification Prefs">
      <div className="space-y-6">
        {[
          { id: "readingReminders", label: "Reading Reminders", desc: "Get reminded if you haven't read for a while." },
          { id: "hifzRepetitions", label: "Hifz Repetitions", desc: "Alerts for your scheduled hifz reviews." },
          { id: "khatamDaily", label: "Daily Khatam Update", desc: "Notification when it's time for your daily juz." },
          { id: "marketing", label: "Community & Updates", desc: "Stay informed about new app features." },
        ].map((item) => (
          <label key={item.id} className="flex cursor-pointer items-start justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-bold">{item.label}</p>
              <p className="max-w-sm text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <div className="pt-1">
              <SettingsToggle
                checked={notifications[item.id as keyof NotificationSettings]}
                onToggle={() => onToggle(item.id as keyof NotificationSettings)}
              />
            </div>
          </label>
        ))}
      </div>
    </SettingsCard>
  );
}
