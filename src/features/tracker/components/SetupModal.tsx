"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { addDays, daysBetween, formatDate, toDateStr, today } from "@/features/tracker/components/trackerPageShared";

type SetupModalProps = {
  onSave: (payload: { name: string; startJuz: number; targetDate: string }) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
};

export function SetupModal({ onSave, onClose, isSubmitting }: SetupModalProps) {
  const [name, setName] = useState("Ramadan Challenge");
  const [startJuz, setStartJuz] = useState(1);
  const [targetDays, setTargetDays] = useState(30);
  const [targetDate, setTargetDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 29);
    return toDateStr(next);
  });
  const [useCustomDate, setUseCustomDate] = useState(false);

  const presets = [
    { label: "30 Days", days: 30 },
    { label: "60 Days", days: 60 },
    { label: "90 Days", days: 90 },
    { label: "180 Days", days: 180 },
  ];

  const handlePreset = (days: number) => {
    setTargetDays(days);
    const next = new Date();
    next.setDate(next.getDate() + days - 1);
    setTargetDate(toDateStr(next));
    setUseCustomDate(false);
  };

  const handleCustomDate = (value: string) => {
    setTargetDate(value);
    setUseCustomDate(true);
    setTargetDays(daysBetween(today(), value) + 1);
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300" onClick={onClose} />
      <div className="animate-in slide-in-from-bottom-8 relative z-201 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-4xl border border-border bg-card p-6 shadow-2xl duration-500 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold">New plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">Configure your khatam schedule.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-base outline-none transition-colors focus:border-primary"
              placeholder="e.g. Daily Check-in"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start from Juz</label>
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 15, 20, 25, 29].map((juz) => (
                <button
                  key={juz}
                  type="button"
                  onClick={() => setStartJuz(juz)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    startJuz === juz ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {juz}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Or custom:</span>
              <input
                type="number"
                min={1}
                max={30}
                value={startJuz}
                onChange={(event) => setStartJuz(Math.min(30, Math.max(1, Number(event.target.value))))}
                className="w-16 rounded-xl border border-border bg-transparent px-3 py-2 text-center text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handlePreset(preset.days)}
                  className={`rounded-xl py-2.5 text-sm font-medium transition-all ${
                    !useCustomDate && targetDays === preset.days
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-muted-foreground">Or end date:</span>
              <input
                type="date"
                value={targetDate}
                min={addDays(today(), 1)}
                onChange={(event) => handleCustomDate(event.target.value)}
                className="flex-1 rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Reading Style</span>
              <span className="font-bold text-primary">Verse-based targets</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Distribution</span>
              <span>Auto-split across {targetDays} days</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
              <span>Goal</span>
              <span>Complete by {formatDate(targetDate)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void onSave({
                name: name.trim() || "My Khatam",
                startJuz,
                targetDate,
              });
            }}
            disabled={isSubmitting}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            {isSubmitting ? "Starting..." : "Start Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
