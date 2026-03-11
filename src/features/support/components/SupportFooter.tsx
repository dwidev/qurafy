"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function SupportFooter({
  href,
  icon: Icon,
  iconClassName,
  title,
  linkLabel,
  brandText,
}: {
  href: string;
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  linkLabel: string;
  brandText: string;
}) {
  return (
    <div className="space-y-6 text-center">
      <Link
        href={href}
        className="group/link inline-flex items-center gap-2.5 text-[11px] font-bold text-muted-foreground/60 transition-all hover:text-foreground"
      >
        <Icon className={iconClassName} />
        {title}
        <span className="ml-1 text-[10px] font-extrabold underline decoration-current/30 underline-offset-4 transition-all group-hover/link:decoration-current">
          {linkLabel}
        </span>
      </Link>

      <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
        <div className="h-px w-8 bg-current" />
        {brandText}
        <div className="h-px w-8 bg-current" />
      </div>
    </div>
  );
}
