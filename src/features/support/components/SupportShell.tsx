"use client";

import { cn } from "@/lib/utils";

export function SupportShell({
  accent,
  className,
  children,
}: {
  accent: "rose" | "emerald";
  className?: string;
  children: React.ReactNode;
}) {
  const glowClass =
    accent === "rose"
      ? {
          top: "bg-rose-500/5",
          bottom: "bg-rose-500/5",
          selection: "selection:bg-rose-500/10",
        }
      : {
          top: "bg-emerald-500/10",
          bottom: "bg-emerald-500/10",
          selection: "selection:bg-emerald-500/10",
        };

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6",
        glowClass.selection,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className={cn("absolute left-[15%] top-[10%] h-64 w-64 rounded-full blur-[120px]", glowClass.top)} />
        <div className={cn("absolute bottom-[10%] right-[15%] h-64 w-64 rounded-full blur-[120px]", glowClass.bottom)} />
      </div>
      {children}
    </div>
  );
}
