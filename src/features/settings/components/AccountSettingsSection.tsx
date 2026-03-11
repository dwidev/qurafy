"use client";

import { SettingsCard } from "@/features/settings/components/SettingsCard";

export function AccountSettingsSection() {
  return (
    <div className="space-y-6">
      <SettingsCard title="Personal Information">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input
              type="text"
              defaultValue="Ahmad Faris"
              className="h-11 w-full rounded-xl border border-border bg-transparent px-4 text-sm font-medium outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              type="email"
              defaultValue="faris@qurafy.io"
              disabled
              className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm font-medium outline-none"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Danger Zone">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Permanently delete your account and all your reading progress. This action cannot be undone.
        </p>
        <button
          type="button"
          className="rounded-full bg-destructive/10 px-6 py-3 text-sm font-bold text-destructive transition-all hover:bg-destructive hover:text-white"
        >
          Delete Account
        </button>
      </SettingsCard>
    </div>
  );
}
