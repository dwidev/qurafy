"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Settings2, ChevronRight } from "lucide-react";
import {
  getReadErrorMessage,
  isUnauthorizedReadError,
  useReadListQuery,
} from "@/features/read/api/client";
import { ReadQuranPageSkeleton } from "@/features/read/components/ReadQuranPageSkeleton";

export default function ReadQuranPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useReadListQuery();
  const [tab, setTab] = useState<"surah" | "juz">("surah");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (error && isUnauthorizedReadError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isError) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h2 className="text-lg font-black">Could not load Quran list</h2>
          <p className="text-sm text-muted-foreground">{getReadErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <ReadQuranPageSkeleton />;
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSurahs = data.surahs.filter((surah) => {
    return (
      surah.en.toLowerCase().includes(normalizedQuery) ||
      surah.ar.includes(searchQuery) ||
      surah.n.toString() === searchQuery.trim()
    );
  });

  const filteredJuzs = data.juzs.filter((juz) => {
    if (juz.n.toString() === searchQuery.trim()) {
      return true;
    }

    return `juz ${juz.n}`.includes(normalizedQuery);
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </span>
            Read Quran
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Explore and read the Holy Quran.</p>
        </div>
      </div>

      <div className="sticky top-0 z-10 flex flex-col md:flex-row items-center gap-4 py-4 bg-background/95 backdrop-blur-md rounded-2xl mx-1 pt-4 pb-2">
        <div className="flex items-center w-full md:w-auto p-1 bg-secondary rounded-full shadow-sm">
          <button
            onClick={() => setTab("surah")}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-full transition-all ${tab === "surah" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-black/5"}`}
          >
            Surah
          </button>
          <button
            onClick={() => setTab("juz")}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-full transition-all ${tab === "juz" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-black/5"}`}
          >
            Juz
          </button>
        </div>

        <div className="relative flex-1 w-full flex items-center gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search surah, translation, or ayah..."
              className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 hover:border-primary/30 hover:shadow-md"
            />
          </div>

          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground group">
            <Settings2 className="h-5 w-5 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4">
        {tab === "surah" &&
          filteredSurahs.map((surah) => (
            <Link
              href={`/app/read/surah-${surah.n}`}
              key={surah.n}
              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {surah.n}
                </div>
                <div className="min-w-0 pr-2">
                  <h3 className="font-bold truncate group-hover:text-primary transition-colors text-sm md:text-base">
                    {surah.en}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {surah.loc} • {surah.verses} Verses
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center justify-end shrink-0">
                <div
                  className="text-xl md:text-2xl font-bold font-serif opacity-80 group-hover:opacity-100 group-hover:text-primary transition-all pr-2 truncate"
                  dir="rtl"
                >
                  {surah.ar}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}

        {tab === "juz" &&
          filteredJuzs.map((juz) => (
            <Link
              href={`/app/read/juz-${juz.n}`}
              key={juz.n}
              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {juz.n}
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-primary transition-colors text-sm md:text-base">
                    Juz {juz.n}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{juz.start}</p>
                </div>
              </div>
              <div className="text-right flex items-center justify-end">
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}

        {((tab === "surah" && filteredSurahs.length === 0) || (tab === "juz" && filteredJuzs.length === 0)) && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center">
            <p className="text-muted-foreground">No matches found for &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
