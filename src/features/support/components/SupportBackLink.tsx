"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function SupportBackLink() {
  return (
    <Link
      href="/"
      className="group absolute left-8 top-8 z-20 flex items-center gap-2 text-muted-foreground transition-all hover:text-foreground"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm transition-all hover:shadow-md">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="-translate-x-2 text-[10px] font-black uppercase tracking-widest opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
        Exit
      </span>
    </Link>
  );
}
