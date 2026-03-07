"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, showLabel = false }: { className?: string, showLabel?: boolean }) {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={cn(
                "group relative flex items-center justify-center rounded-2xl transition-all outline-none cursor-pointer",
                className
            )}
        >
            <div className="relative flex items-center justify-center h-5 w-5 md:h-5 md:w-5">
                <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>

            {!showLabel && (
                <div className="absolute left-full ml-5 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl border border-border/10 hidden md:block">
                    Toggle Theme
                    <div className="absolute top-1/2 -mt-1.5 -left-3 border-[6px] border-transparent border-r-foreground" />
                </div>
            )}
        </button>
    );
}
