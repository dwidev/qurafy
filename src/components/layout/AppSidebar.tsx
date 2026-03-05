"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calendar, LayoutDashboard, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Read Quran",
    href: "/app/read",
    icon: BookOpen,
  },
  {
    title: "Memorization",
    href: "/app/memorize",
    icon: Target,
  },
  {
    title: "Khatam Tracker",
    href: "/app/tracker",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-background/50 backdrop-blur-sm sticky top-0 hidden md:flex">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Qurafy</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            U
          </div>
          <span>User Name</span>
        </div>
      </div>
    </div>
  );
}
