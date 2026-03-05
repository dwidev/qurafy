import { BookOpen, Calendar, Target } from "lucide-react";
import Link from "next/link";

export default function AppDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Read Card */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col p-6 gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Continue Reading</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Resume from where you left off.
          </p>
          <div className="mt-auto">
            <Link 
              href="/app/read" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Open Reader
            </Link>
          </div>
        </div>

        {/* Memorization Card */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col p-6 gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Today's Memorization</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Review your daily target verses.
          </p>
          <div className="mt-auto">
            <Link 
              href="/app/memorize" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              View Plan
            </Link>
          </div>
        </div>

        {/* Khatam Tracker Card */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col p-6 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Khatam Progress</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Track your daily reading schedule for Khatam completion.
          </p>
          <div className="mt-auto">
            <Link 
              href="/app/tracker" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Update Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
