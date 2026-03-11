"use client";

import { X } from "lucide-react";

export function MemorizeSessionHeader({
  showProgress,
  currentVerseIndex,
  totalVerses,
  onExit,
}: {
  showProgress: boolean;
  currentVerseIndex: number;
  totalVerses: number;
  onExit: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-foreground/5 p-4 md:p-6">
      <button
        type="button"
        onClick={onExit}
        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
      >
        <X className="h-6 w-6" />
      </button>

      {showProgress ? (
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Memorization Focus</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            {Array.from({ length: totalVerses }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentVerseIndex
                    ? "w-6 bg-primary"
                    : index < currentVerseIndex
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-10" />
      )}

      <div className="w-10" />
    </div>
  );
}
