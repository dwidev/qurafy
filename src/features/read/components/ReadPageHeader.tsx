"use client";

import { BookOpen } from "lucide-react";

export function ReadPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </span>
          Read Quran
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Explore and read the Holy Quran.</p>
      </div>
    </div>
  );
}
