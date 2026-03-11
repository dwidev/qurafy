"use client";

import { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { addDays, type KhatamPlan, today } from "@/features/tracker/components/trackerPageShared";

type EditModalProps = {
  plan: KhatamPlan;
  onSave: (payload: { planId: string; name: string; targetDate: string }) => Promise<void>;
  onClose: () => void;
  onReset: (payload: { planId: string }) => Promise<void>;
};

export function EditModal({ plan, onSave, onClose, onReset }: EditModalProps) {
  const [name, setName] = useState(plan.name);
  const [targetDate, setTargetDate] = useState(plan.targetDate);
  const [confirmReset, setConfirmReset] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    void onSave({ planId: plan.id, name, targetDate }).finally(() => setIsSaving(false));
  };

  const handleDelete = () => {
    setIsDeleting(true);
    void onReset({ planId: plan.id }).finally(() => setIsDeleting(false));
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-in fade-in bg-background/80 backdrop-blur-sm duration-300" onClick={onClose} />
      <div className="animate-in slide-in-from-bottom-8 relative z-201 w-full max-w-md rounded-4xl border border-border bg-card p-6 shadow-2xl duration-500 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Edit plan</h2>
          <p className="text-sm text-muted-foreground">Update the plan name or finish date.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Date</label>
            <input
              type="date"
              value={targetDate}
              min={addDays(today(), 1)}
              onChange={(event) => setTargetDate(event.target.value)}
              className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isDeleting}
            className="mt-2 h-12 w-full rounded-full bg-primary text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <RotateCcw className="h-4 w-4" />
              Delete Plan
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">This deletes all progress. Are you sure?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="h-10 flex-1 rounded-full bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
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
