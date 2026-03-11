"use client";

import { Palette } from "lucide-react";
import { SettingsCard } from "@/features/settings/components/SettingsCard";
import type { AppearanceSettings } from "@/features/settings/components/settings-types";

export function AppearanceSettingsSection({
  appearance,
  onThemeChange,
  onToggleMushafMode,
}: {
  appearance: AppearanceSettings;
  onThemeChange: (theme: AppearanceSettings["theme"]) => void;
  onToggleMushafMode: () => void;
}) {
  return (
    <SettingsCard title="App Look & Feel">
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Theme</p>
        <div className="grid grid-cols-3 gap-4">
          {["light", "dark", "system"].map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => onThemeChange(theme as AppearanceSettings["theme"])}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all ${
                appearance.theme === theme ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <Palette className="h-5 w-5" />
              <span className="text-xs font-bold capitalize">{theme}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Arabic Reading Mode</p>
          <button type="button" onClick={onToggleMushafMode} className="text-xs font-bold text-primary">
            Change to {appearance.mushafMode ? "Verse" : "Mushaf"}
          </button>
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-border bg-muted/30 p-6 text-center">
          <div className="space-y-2">
            <p className="font-serif text-2xl font-bold" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-xs text-muted-foreground">Preview of current font size ({appearance.fontSize}/7)</p>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
