"use client";

import { Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <div>
      <h1 className="flex items-center gap-2.5 text-3xl font-black tracking-tight">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </span>
        Settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account and app preferences.</p>
    </div>
  );
}
