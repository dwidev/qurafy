"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getReadErrorMessage,
  isUnauthorizedReadError,
  useReadListQuery,
} from "@/features/read/api/client";
import { ReadQuranPageSkeleton } from "@/features/read/components/ReadQuranPageSkeleton";
import {
  filterJuzs,
  filterSurahs,
  ReadListEmptyState,
  ReadListErrorState,
  ReadListGrid,
  ReadPageHeader,
  ReadToolbar,
  type ReadListTab,
} from "@/features/read/components/ReadQuranPageSections";
import type { ReadListData } from "@/features/read/types";

export default function ReadQuranPage({ initialData }: { initialData?: ReadListData }) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useReadListQuery({ initialData });
  const [tab, setTab] = useState<ReadListTab>("surah");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (error && isUnauthorizedReadError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isError) {
    return <ReadListErrorState message={getReadErrorMessage(error)} onRetry={() => refetch()} />;
  }

  if (isLoading || !data) {
    return <ReadQuranPageSkeleton />;
  }

  const filteredSurahs = filterSurahs(data.surahs, searchQuery);
  const filteredJuzs = filterJuzs(data.juzs, searchQuery);
  const isEmpty = tab === "surah" ? filteredSurahs.length === 0 : filteredJuzs.length === 0;

  return (
    <div className="flex-1 space-y-6 p-4 pb-20 pt-6 md:p-8 max-w-5xl mx-auto">
      <ReadPageHeader />
      <ReadToolbar
        activeTab={tab}
        searchQuery={searchQuery}
        onTabChange={setTab}
        onSearchChange={setSearchQuery}
      />

      {isEmpty ? (
        <ReadListEmptyState activeTab={tab} searchQuery={searchQuery} />
      ) : (
        <ReadListGrid activeTab={tab} surahs={filteredSurahs} juzs={filteredJuzs} />
      )}
    </div>
  );
}
