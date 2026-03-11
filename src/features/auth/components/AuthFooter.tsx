"use client";

import { Sparkles } from "lucide-react";

export function AuthFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 pt-1 text-center">
      {children}
      <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground opacity-30">
        <Sparkles className="h-2.5 w-2.5" />
        Digital Islamic Excellence
      </div>
    </div>
  );
}
