"use client";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { settingsTabs } from "@/features/settings/components/settingsTabs";
import type { SettingsTab } from "@/features/settings/components/settings-types";

export function SettingsSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}) {
  return (
    <div className="space-y-2">
      {settingsTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
      <LogoutButton
        showLabel
        className="w-full rounded-b-[1.25rem] p-4 text-sm font-bold text-destructive transition-colors hover:bg-muted/50"
        iconClassName="h-4 w-4"
      />
    </div>
  );
}
