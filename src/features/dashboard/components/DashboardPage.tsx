"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, History } from "lucide-react";
import { PrayerTimesBar } from "@/features/dashboard/components/PrayerTimesBar";
import { QuickStats } from "@/features/dashboard/components/QuickStats";
import { DailyInspiration } from "@/features/dashboard/components/DailyInspiration";
import { ContinueReading } from "@/features/dashboard/components/ContinueReading";
import { ProgressSection } from "@/features/dashboard/components/ProgressSection";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import {
  getDashboardErrorMessage,
  isUnauthorizedDashboardError,
  useDashboardMeQuery,
} from "@/features/dashboard/api/client";
import { DashboardPageSkeleton } from "@/features/dashboard/components/DashboardPageSkeleton";

export function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useDashboardMeQuery();

  useEffect(() => {
    if (error && isUnauthorizedDashboardError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isError) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto pb-24">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h2 className="text-lg font-black">Could not load dashboard</h2>
          <p className="text-sm text-muted-foreground">{getDashboardErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <DashboardPageSkeleton />;
  }

  const displayName = data.user.name.trim() || "User";
  const dashboard = data.dashboard;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-32">
      <PrayerTimesBar />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
              <span className="text-primary text-xl">👋</span>
            </span>
            Assalamu&apos;alaikum, {displayName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            {dashboard.dateInfo.gregorian} • {dashboard.dateInfo.hijri}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card shadow-sm hover:shadow-md transition-all">
            <History className="h-4 w-4 text-muted-foreground" />
          </button>
          <Link href="/app/settings" className="h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card shadow-sm hover:shadow-md transition-all">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <QuickStats isNewUser={dashboard.isNewUser} stats={dashboard.quickStats} />
      <DailyInspiration quote={dashboard.dailyVerse} />
      <ContinueReading
        readingQuranData={dashboard.readingQuranData}
        khatamProgressData={dashboard.khatamProgressData}
      />
      <ProgressSection
        isNewUser={dashboard.isNewUser}
        memorizationCard={dashboard.memorizationCard}
        khatamCard={dashboard.khatamCard}
      />
      <RecentActivity items={dashboard.recentItems} />
    </div>
  );
}
