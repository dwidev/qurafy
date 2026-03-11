"use client";

import { cn } from "@/lib/utils";
import type { DonationPreset } from "@/types";

export function PresetButtonGrid({
  presets,
  selectedValue,
  customValue,
  onSelect,
}: {
  presets: DonationPreset[];
  selectedValue: string;
  customValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {presets.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onSelect(preset.value)}
          className={cn(
            "flex h-14 items-center justify-center gap-1.5 rounded-2xl border-2 text-sm font-black transition-all duration-300",
            selectedValue === preset.value && !customValue
              ? "border-foreground bg-foreground text-background shadow-lg shadow-foreground/10"
              : "border-border/50 bg-background text-muted-foreground hover:border-foreground/10",
          )}
        >
          <span className="text-[9px] font-bold opacity-40">IDR</span>
          {preset.label}
        </button>
      ))}
    </div>
  );
}
