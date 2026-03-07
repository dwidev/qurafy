import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import type { ReadingData } from "@/types";

interface ContinueReadingProps {
    readingQuranData: ReadingData | null;
    khatamProgressData: ReadingData | null;
}

export function ContinueReading({ readingQuranData, khatamProgressData }: ContinueReadingProps) {
    if (!readingQuranData && !khatamProgressData) {
        return (
            <div className="group relative rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 md:p-10 shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden text-center flex flex-col items-center justify-center space-y-5">
                <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                    <BookOpen className="h-8 w-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold relative z-10">Start Your Quran Journey</h2>
                <p className="text-muted-foreground max-w-md relative z-10">
                    Begin reading the Quran or start a Khatam plan to track your daily progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10 pt-2">
                    <Link href="/app/read" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start Reading
                    </Link>
                    <Link href="/app/tracker" className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start Khatam
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden flex flex-col md:flex-row">
            <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />

            {/* Reading Quran Side */}
            {readingQuranData && (
                <div className={`relative z-10 flex flex-col justify-between p-6 md:p-8 ${khatamProgressData ? 'md:w-1/2 border-b md:border-b-0 md:border-r border-primary/10' : 'w-full flex-col md:flex-row md:items-center gap-6'}`}>
                    <div className="space-y-4 mb-6 md:mb-0 max-w-lg">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            Continue Reading | <span className="text-blue-500">Reading Quran</span>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-bold truncate">{readingQuranData.surah}</h2>
                            <p className="text-muted-foreground text-sm">{readingQuranData.verse}</p>
                        </div>
                        <p className="text-xl md:text-2xl font-serif text-foreground/80 font-bold hidden sm:block pt-2" dir="rtl">
                            {readingQuranData.arabic}
                        </p>
                    </div>
                    <div className={khatamProgressData ? "mt-4" : "shrink-0"}>
                        <Link
                            href={readingQuranData.link}
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Resume <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Khatam Progress Side */}
            {khatamProgressData && (
                <div className={`relative z-10 flex flex-col justify-between p-6 md:p-8 ${readingQuranData ? 'md:w-1/2' : 'w-full flex-col md:flex-row md:items-center gap-6'}`}>
                    <div className="space-y-4 mb-6 md:mb-0 max-w-lg">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            Continue Reading | <span className="text-orange-500">Khatam Progress</span>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-bold truncate">{khatamProgressData.surah}</h2>
                            <p className="text-muted-foreground text-sm">{khatamProgressData.verse}</p>
                        </div>
                        <p className="text-xl md:text-2xl font-serif text-foreground/80 font-bold hidden sm:block pt-2" dir="rtl">
                            {khatamProgressData.arabic}
                        </p>
                    </div>
                    <div className={readingQuranData ? "mt-4" : "flex-shrink-0"}>
                        <Link
                            href={khatamProgressData.link}
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Resume <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
