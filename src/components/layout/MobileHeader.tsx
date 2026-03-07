"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { mobileNavItems } from "@/config/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4">
        <Link href="/app" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Qurafy</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile nav overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex bg-background/80 backdrop-blur-sm md:hidden">
          <div className="w-4/5 max-w-sm bg-background border-r border-border h-full flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-xl font-bold tracking-tight">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Dark Mode</span>
              <ThemeToggle className="p-2 border border-border" />
            </div>

            <div className="p-4 border-t border-border">
              <LogoutButton
                onDone={() => setIsOpen(false)}
                showLabel
                className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors text-destructive hover:bg-destructive/10"
                iconClassName="h-5 w-5"
              />
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
