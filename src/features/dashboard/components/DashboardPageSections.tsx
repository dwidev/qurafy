"use client";

import { PageFeedback } from "@/components/ui/page-feedback";
import { ContinueReading } from "@/features/dashboard/components/ContinueReading";
import { DailyInspiration } from "@/features/dashboard/components/DailyInspiration";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { PrayerTimesBar } from "@/features/dashboard/components/PrayerTimesBar";
import { ProgressSection } from "@/features/dashboard/components/ProgressSection";
import { QuickStats } from "@/features/dashboard/components/QuickStats";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import type { DashboardMeData } from "@/features/dashboard/types";

export function getDashboardDisplayName(name: string) {
  return name.split(" ")[0]?.trim() || "User";
}

export function DashboardPageErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <PageFeedback
      title="Could not load dashboard"
      message={message}
      tone="error"
      actions={[{ label: "Retry", onClick: onRetry }]}
    />
  );
}

export function DashboardPageContent({ data }: { data: DashboardMeData }) {
  const displayName = getDashboardDisplayName(data.user.name);
  const dashboard = data.dashboard;

  return (
    <div className="flex-1 space-y-8 p-4 pb-32 pt-6 md:p-8 max-w-5xl mx-auto">
      <PrayerTimesBar />
      <PageHeader displayName={displayName} dateInfo={dashboard.dateInfo} />
      <QuickStats isNewUser={dashboard.isNewUser} stats={dashboard.quickStats} />
      <DailyInspiration quote={dashboard.dailyVerse} />
      <ContinueReading
        memorizationReadingData={dashboard.memorizationReadingData}
        khatamReadingData={dashboard.khatamReadingData}
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
