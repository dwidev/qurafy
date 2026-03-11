"use client";

import { Search, Settings2 } from "lucide-react";
import type { ReadListTab } from "@/features/read/components/read-list-utils";

function ReadToolbarTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-6 py-2 text-sm transition-all md:flex-none ${
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
      } ${label === "Surah" ? "font-semibold" : "font-medium"}`}
    >
      {label}
    </button>
  );
}

export function ReadToolbar({
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
}: {
  activeTab: ReadListTab;
  searchQuery: string;
  onTabChange: (tab: ReadListTab) => void;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="sticky top-0 z-10 mx-1 flex flex-col items-center gap-4 rounded-2xl bg-background/95 py-4 pb-2 pt-4 backdrop-blur-md md:flex-row">
      <div className="flex w-full items-center rounded-full bg-secondary p-1 shadow-sm md:w-auto">
        <ReadToolbarTab label="Surah" isActive={activeTab === "surah"} onClick={() => onTabChange("surah")} />
        <ReadToolbarTab label="Juz" isActive={activeTab === "juz"} onClick={() => onTabChange("juz")} />
      </div>

      <div className="relative flex w-full flex-1 items-center gap-3">
        <div className="group relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search surah, translation, or ayah..."
            className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm font-medium shadow-sm transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/30 hover:shadow-md"
          />
        </div>

        <button className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-muted hover:text-foreground">
          <Settings2 className="h-5 w-5 transition-colors group-hover:text-primary" />
        </button>
      </div>
    </div>
  );
}
