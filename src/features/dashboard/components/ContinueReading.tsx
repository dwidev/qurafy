import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import type { ReadingData } from "@/types";

interface ContinueReadingProps {
  memorizationReadingData: ReadingData | null;
  khatamReadingData: ReadingData | null;
}

function getReadingCopy(readingData: ReadingData) {
  if (readingData.readingType === "memorization") {
    return {
      badgeLabel: "Memorization",
      badgeClassName: "text-emerald-600",
      actionLabel: "Continue Memorizing",
    };
  }

  if (readingData.readingType === "khatam") {
    return {
      badgeLabel: "Khatam Plan",
      badgeClassName: "text-orange-500",
      actionLabel: "Continue Khatam",
    };
  }

  return {
    badgeLabel: "Reading Quran",
    badgeClassName: "text-blue-500",
    actionLabel: "Resume Reading",
  };
}

function ContinueReadingCard({
  readingData,
  hasSibling,
  bordered,
}: {
  readingData: ReadingData;
  hasSibling: boolean;
  bordered?: boolean;
}) {
  const copy = getReadingCopy(readingData);
  const layoutClassName = hasSibling
    ? `md:w-1/2 ${bordered ? "border-b md:border-b-0 md:border-r border-primary/10" : ""}`
    : "w-full md:flex-row md:items-center gap-6";

  return (
    <div className={`relative z-10 flex flex-col justify-between p-6 md:p-8 ${layoutClassName}`}>
      <div className="mb-6 max-w-lg space-y-4 md:mb-0">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Continue <span className={copy.badgeClassName}>| {copy.badgeLabel}</span>
        </div>
        <div className="space-y-1">
          <h2 className="truncate text-2xl font-bold md:text-3xl">{readingData.surah}</h2>
          <p className="text-sm text-muted-foreground">{readingData.verse}</p>
        </div>
        <p className="hidden pt-2 text-xl font-bold text-foreground/80 sm:block md:text-2xl" dir="rtl">
          {readingData.arabic}
        </p>
      </div>
      <div className={hasSibling ? "shrink-0" : "mt-4"}>
        <Link
          href={readingData.link}
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
        >
          {copy.actionLabel} <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function ContinueReading({ memorizationReadingData, khatamReadingData }: ContinueReadingProps) {
  if (!memorizationReadingData && !khatamReadingData) {
    return (
      <div className="group relative flex flex-col items-center justify-center space-y-5 overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-card to-primary/5 p-6 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:p-10">
        <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 opacity-50 blur-3xl transition-opacity group-hover:opacity-100" />
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="relative z-10 text-2xl font-bold md:text-3xl">Start Your Quran Journey</h2>
        <p className="relative z-10 max-w-md text-muted-foreground">
          Begin reading the Quran or start a Khatam plan to track your daily progress.
        </p>
        <div className="relative z-10 flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
          <Link
            href="/app/read"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
          >
            Start Reading
          </Link>
          <Link
            href="/app/tracker"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.98]"
          >
            Start Khatam
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-card to-primary/5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:flex-row">
      <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 opacity-50 blur-3xl transition-opacity group-hover:opacity-100" />

      {memorizationReadingData ? (
        <ContinueReadingCard
          readingData={memorizationReadingData}
          hasSibling={Boolean(khatamReadingData)}
          bordered={Boolean(khatamReadingData)}
        />
      ) : null}

      {khatamReadingData ? (
        <ContinueReadingCard
          readingData={khatamReadingData}
          hasSibling={Boolean(memorizationReadingData)}
        />
      ) : null}
    </div>
  );
}
