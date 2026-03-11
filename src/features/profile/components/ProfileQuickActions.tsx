"use client";

import Link from "next/link";
import { Bell, ChevronRight, Settings, Shield } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function ProfileQuickActions() {
  return (
    <div className="space-y-6">
      <h2 className="px-1 text-2xl font-black">Quick Actions</h2>
      <div className="divide-y divide-border/50 rounded-3xl border border-border bg-card p-2 shadow-sm">
        {[
          { label: "Account Settings", icon: Settings, href: "/app/settings", color: "text-foreground" },
          { label: "Notification Prefs", icon: Bell, href: "/app/settings", color: "text-foreground" },
          { label: "Privacy & Security", icon: Shield, href: "/app/settings", color: "text-foreground" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between p-4 transition-colors first:rounded-t-[1.25rem] hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/50 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className={`text-sm font-bold ${item.color}`}>{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
          </Link>
        ))}
        <LogoutButton
          showLabel
          className="w-full rounded-b-[1.25rem] p-4 text-sm font-bold text-destructive transition-colors hover:bg-muted/50"
          iconClassName="h-4 w-4"
        />
      </div>
    </div>
  );
}
