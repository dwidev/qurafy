"use client";

import type { LucideIcon } from "lucide-react";

export function SupportHeader({
  icon: Icon,
  iconClassName,
  title,
  description,
}: {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="space-y-4 text-center">
      <div className="inline-flex flex-col items-center gap-6">
        <div className="group relative">
          <div className="absolute -inset-4 rounded-full bg-white/0 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-border bg-card shadow-sm">
            <Icon className={iconClassName} />
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-foreground">{title}</h1>
          <div className="text-[14px] font-medium leading-relaxed text-muted-foreground">{description}</div>
        </div>
      </div>
    </div>
  );
}
