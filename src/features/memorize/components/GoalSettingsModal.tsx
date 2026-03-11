"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import type { MemorizeMeData } from "@/features/memorize/types";

type GoalSettingsModalProps = {
  goal: NonNullable<MemorizeMeData["activeGoal"]>;
  onClose: () => void;
  onSave: (payload: { goalId: string; targetDays: number; repsPerVerse: number }) => Promise<void>;
  onDelete: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
};

export function GoalSettingsModal({
  goal,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: GoalSettingsModalProps) {
  const minimumTargetDays = Math.max(7, goal.todayTarget?.dayNumber ?? goal.passedDays);
  const maximumTargetDays = Math.max(90, goal.targetDays, minimumTargetDays);
  const [targetDays, setTargetDays] = useState(goal.targetDays);
  const [repsPerVerse, setRepsPerVerse] = useState(goal.repsPerVerse);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300" onClick={onClose} />
      <div className="animate-in slide-in-from-bottom-8 relative z-201 w-full max-w-md rounded-4xl border border-border bg-card p-6 shadow-2xl duration-500 md:p-8">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Goal Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your active memorization goal.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Goal</p>
            <p className="mt-1 text-base font-semibold">{goal.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{goal.surahName}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Target Duration</label>
              <span className="font-bold text-primary">{targetDays} days</span>
            </div>
            <input
              type="range"
              min={minimumTargetDays}
              max={maximumTargetDays}
              step={1}
              value={targetDays}
              onChange={(event) => setTargetDays(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
            />
            <p className="text-xs text-muted-foreground">Minimum {minimumTargetDays} days based on your current progress.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Repetitions per Verse</label>
              <span className="font-bold text-primary">{repsPerVerse}x</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 3, 5, 7, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setRepsPerVerse(value)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${repsPerVerse === value ? "scale-105 border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50"}`}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              void onSave({ goalId: goal.id, targetDays, repsPerVerse });
            }}
            disabled={isSaving || isDeleting}
            className="h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" /> Delete Goal
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">This deletes all progress. Are you sure?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-10 flex-1 rounded-full bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    void onDelete();
                  }}
                  disabled={isDeleting || isSaving}
                  className="h-10 flex-1 rounded-full bg-destructive text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
