"use client";

import { BookOpen, Plus } from "lucide-react";

function WelcomeFeature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
        {number}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function WelcomeState({ onOpenSetup }: { onOpenSetup: () => void }) {
  return (
    <div className="animate-in fade-in zoom-in-95 py-16 text-center duration-500 md:py-24">
      <div className="relative mb-8 flex justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-4xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
      </div>
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Start your khatam journey</h2>
      <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground md:text-lg">
        Plan your Quran reading, split the targets automatically, and stay consistent every day.
      </p>
      <button
        type="button"
        onClick={onOpenSetup}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
      >
        <Plus className="h-5 w-5" />
        Create Khatam Plan
      </button>

      <div className="mx-auto mt-20 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
        <WelcomeFeature number="1" title="Set a target" description="Choose a starting juz and target finish date." />
        <WelcomeFeature number="2" title="Follow the schedule" description="Qurafy splits the remaining reading into exact daily ranges." />
        <WelcomeFeature number="3" title="Stay accountable" description="Mark days done and watch your consistency improve." />
      </div>
    </div>
  );
}
