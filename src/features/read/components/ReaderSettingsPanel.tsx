"use client";

import { BookOpen, Menu, X } from "lucide-react";
import type { ReaderSettings } from "@/features/read/components/reader-settings";

function ReaderToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary"}`}>
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-6" : "left-1"}`}
        />
      </div>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

type ReaderSettingsPanelProps = {
  settings: ReaderSettings;
  onClose: () => void;
  onUpdate: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
};

export function ReaderSettingsPanel({ settings, onClose, onUpdate }: ReaderSettingsPanelProps) {
  return (
    <div className="animate-in slide-in-from-top-2 sticky top-16 z-10 flex flex-col gap-6 border-b border-border bg-card p-6 shadow-lg duration-200">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Reading Settings</h3>
        <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reading Mode</label>
          <div className="flex rounded-xl bg-secondary p-1">
            <button
              onClick={() => onUpdate("mode", "verse")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${settings.mode === "verse" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Menu className="h-4 w-4" /> Verse by Verse
            </button>
            <button
              onClick={() => onUpdate("mode", "mushaf")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${settings.mode === "mushaf" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <BookOpen className="h-4 w-4" /> Mushaf
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arabic Font Size</label>
            <span className="text-xs font-medium text-muted-foreground">{settings.arabicSize}/7</span>
          </div>
          <input
            type="range"
            min="1"
            max="7"
            value={settings.arabicSize}
            onChange={(event) => onUpdate("arabicSize", Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visibility</label>
          <div className="space-y-3">
            <ReaderToggle
              checked={settings.showTranslation}
              label="Translation"
              onChange={(checked) => onUpdate("showTranslation", checked)}
            />
            <ReaderToggle
              checked={settings.showTransliteration}
              label="Transliteration (Latin)"
              onChange={(checked) => onUpdate("showTransliteration", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
