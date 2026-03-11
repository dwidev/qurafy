"use client";

import { ChevronRight, Globe, HelpCircle, Shield } from "lucide-react";
import { SettingsCard } from "@/features/settings/components/SettingsCard";

export function GeneralSettingsSection() {
  return (
    <div className="space-y-6">
      <SettingsCard title="App Info">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Version</p>
            <p className="text-xs text-muted-foreground">v2.4.0 (Stable)</p>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            Up to date
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Workspace Storage</p>
            <p className="text-xs text-muted-foreground">Local cache: 14.2 MB</p>
          </div>
          <button type="button" className="text-xs font-bold text-primary hover:underline">
            Clear Cache
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Support">
        <div className="space-y-2">
          {[
            { label: "Help Center & FAQs", icon: HelpCircle },
            { label: "Give Feedback", icon: Globe },
            { label: "Terms of Service", icon: Shield },
            { label: "Privacy Policy", icon: Shield },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center justify-between rounded-xl p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
