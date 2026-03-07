"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems, utilityNavItems } from "@/config/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-50 flex flex-row md:flex-col items-center gap-2 md:gap-4 rounded-4xl border border-border bg-background/80 backdrop-blur-xl p-2.5 md:p-3.5 shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-8 md:slide-in-from-left-8 duration-700">

      {/* Brand logo at the top */}
      <Link href="/" className="group relative hidden md:flex items-center justify-center p-2 mt-1">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        <BookOpen className="h-7 w-7 text-primary relative z-10" />
      </Link>

      <div className="w-8 h-[2px] bg-border/50 rounded-full my-1 hidden md:block" />

      <nav className="flex flex-row md:flex-col gap-2 md:gap-3 items-center">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-center rounded-2xl p-3 md:p-3.5 transition-all outline-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 md:hover:scale-105"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground md:hover:scale-105"
              )}
            >
              <item.icon className="h-5 w-5 md:h-5 md:w-5" />
              <div className="absolute left-full ml-5 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl border border-border/10 hidden md:block">
                {item.title}
                <div className="absolute top-1/2 -mt-1.5 -left-3 border-[6px] border-transparent border-r-foreground" />
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="w-8 h-[2px] bg-border/50 rounded-full my-1 hidden md:block" />

      {/* Utility Actions */}
      <div className="flex flex-row md:flex-col gap-2 md:gap-3 items-center">
        {utilityNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center justify-center rounded-2xl p-3 md:p-3.5 transition-all outline-none",
              pathname === item.href
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <div className="absolute left-full ml-5 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl border border-border/10 hidden md:block">
              {item.title}
              <div className="absolute top-1/2 -mt-1.5 -left-3 border-[6px] border-transparent border-r-foreground" />
            </div>
          </Link>
        ))}
      </div>

      {/* User profile Link */}
      <Link href="/app/profile" className="group relative mt-1 mb-1 hidden md:block">
        <div className={cn(
          "h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-bold border transition-all shadow-inner",
          pathname === "/app/profile"
            ? "bg-primary/10 border-primary text-primary"
            : "bg-secondary border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
        )}>
          A
        </div>
        <div className="absolute left-full ml-5 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl border border-border/10">
          Ahmad Faris
          <div className="absolute top-1/2 -mt-1.5 -left-3 border-[6px] border-transparent border-r-foreground" />
        </div>
      </Link>
    </div>
  );
}
