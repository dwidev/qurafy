"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, History } from "lucide-react";
import { PrayerTimesBar } from "@/features/dashboard/components/PrayerTimesBar";
import { QuickStats } from "@/features/dashboard/components/QuickStats";
import { DailyInspiration } from "@/features/dashboard/components/DailyInspiration";
import { ContinueReading } from "@/features/dashboard/components/ContinueReading";
import { ProgressSection } from "@/features/dashboard/components/ProgressSection";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import {
  dashboardQueryKeys,
  getDashboardErrorMessage,
  isUnauthorizedDashboardError,
  useDashboardMeQuery,
} from "@/features/dashboard/api/client";
import { DashboardPageSkeleton } from "@/features/dashboard/components/DashboardPageSkeleton";
import { PageHeader } from "./PageHeader";

const DASHBOARD_FORCE_RELOAD_STORAGE_KEY = "dashboard.reload.after-memorize";

export function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useDashboardMeQuery();

  useEffect(() => {
    if (error && isUnauthorizedDashboardError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  useEffect(() => {
    const shouldForceReload = window.localStorage.getItem(DASHBOARD_FORCE_RELOAD_STORAGE_KEY);

    if (!shouldForceReload) {
      return;
    }

    window.localStorage.removeItem(DASHBOARD_FORCE_RELOAD_STORAGE_KEY);
    void queryClient.removeQueries({ queryKey: dashboardQueryKeys.me });
    void refetch();
  }, [queryClient, refetch]);

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

  const displayName = data.user.name.split(' ')[0].trim() || "User";
  const dashboard = data.dashboard;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-32">
      <PrayerTimesBar />
      <PageHeader displayName={displayName} dateInfo={dashboard.dateInfo} />
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
