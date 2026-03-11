"use client";

import { BookOpen, Plus } from "lucide-react";

export function MemorizeWelcomeState({ onCreateGoal }: { onCreateGoal: () => void }) {
  return (
    <div className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center py-16 text-center duration-500 md:py-24">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="relative z-10 flex h-32 w-32 rotate-3 items-center justify-center rounded-4xl border border-primary/20 bg-linear-to-br from-primary/20 to-primary/5 shadow-lg transition-transform hover:rotate-6">
          <BookOpen className="h-16 w-16 text-primary drop-shadow-md" />
        </div>
      </div>
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Start Your Memorization Journey</h2>
      <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground md:text-lg">
        Build a lasting habit of memorizing the Quran. Choose a target, set your pace, and we&apos;ll guide you step-by-step with interactive daily repetitions.
      </p>
      <button
        onClick={onCreateGoal}
        className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
      >
        <Plus className="h-5 w-5" /> Create Your First Goal
      </button>

      <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {[
          {
            title: "Set a Target",
            description: "Pick a Surah or Juz and choose how many days you want to complete it in.",
          },
          {
            title: "Guided Repetitions",
            description: "Our interactive guide breaks verses down into bite-sized audio repetitions.",
          },
          {
            title: "Track Progress",
            description: "Keep your streak alive and watch your memorization circular ring fill up!",
          },
        ].map((item, index) => (
          <div key={item.title} className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
              {index + 1}
            </div>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
