import Link from "next/link";
import { Calendar, History } from "lucide-react";
import { PrayerTimesBar } from "@/features/dashboard/components/PrayerTimesBar";
import { QuickStats } from "@/features/dashboard/components/QuickStats";
import { DailyInspiration } from "@/features/dashboard/components/DailyInspiration";
import { ContinueReading } from "@/features/dashboard/components/ContinueReading";
import { ProgressSection } from "@/features/dashboard/components/ProgressSection";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { requireServerSession } from "@/features/auth/server/session";
import { getDashboardViewData } from "@/features/dashboard/server/dashboard-data";

export async function DashboardPage() {
  const session = await requireServerSession();
  const dashboard = await getDashboardViewData(session.user.id);
  const displayName = session?.user.name?.trim() || "User";

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
