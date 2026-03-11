"use client";

import { ContinueReading } from "@/features/dashboard/components/ContinueReading";
import { DailyInspiration } from "@/features/dashboard/components/DailyInspiration";
import { getDashboardDisplayName } from "@/features/dashboard/components/getDashboardDisplayName";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { PrayerTimesBar } from "@/features/dashboard/components/PrayerTimesBar";
import { ProgressSection } from "@/features/dashboard/components/ProgressSection";
import { QuickStats } from "@/features/dashboard/components/QuickStats";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import type { DashboardMeData } from "@/features/dashboard/types";

export function DashboardPageContent({ data }: { data: DashboardMeData }) {
  const displayName = getDashboardDisplayName(data.user.name);
  const dashboard = data.dashboard;

  return (
    <div className="max-w-5xl flex-1 space-y-8 p-4 pb-32 pt-6 md:mx-auto md:p-8">
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
