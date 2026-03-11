"use client";

import type { ReadListTab } from "@/features/read/components/read-list-utils";

export function ReadListEmptyState({
  activeTab,
  searchQuery,
}: {
  activeTab: ReadListTab;
  searchQuery: string;
}) {
  return (
    <div className="py-20 text-center">
      <p className="text-muted-foreground">
        No {activeTab === "surah" ? "surahs" : "juz"} matched &quot;{searchQuery}&quot;.
      </p>
    </div>
  );
}
