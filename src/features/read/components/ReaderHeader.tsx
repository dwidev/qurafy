"use client";

import { ArrowLeft, Settings } from "lucide-react";

type ReaderHeaderProps = {
  title: string;
  subtitle: string;
  isKhatamMode: boolean;
  showSettings: boolean;
  onBack: () => void;
  onToggleSettings: () => void;
};

export function ReaderHeader({
  title,
  subtitle,
  isKhatamMode,
  showSettings,
  onBack,
  onToggleSettings,
}: ReaderHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="rounded-full p-2 transition-colors hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold capitalize leading-tight">{title}</h1>
            {isKhatamMode ? (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                Daily Target
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onToggleSettings}
        className={`rounded-full p-2 transition-colors ${showSettings ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}
