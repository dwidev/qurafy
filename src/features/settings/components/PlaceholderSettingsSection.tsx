"use client";

import { History } from "lucide-react";
import type { SettingsTab } from "@/features/settings/components/settings-types";

export function PlaceholderSettingsSection({ activeTab }: { activeTab: SettingsTab }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-8 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <History className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold capitalize">{activeTab} coming soon</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Our engineers are working hard to bring this feature to you as soon as possible.
      </p>
    </div>
  );
}
