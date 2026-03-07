import Link from "next/link";
import { Calendar, History } from "lucide-react";
import { PrayerTimesBar } from "@/components/dashboard/PrayerTimesBar";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { DailyInspiration } from "@/components/dashboard/DailyInspiration";
import { ContinueReading } from "@/components/dashboard/ContinueReading";
import { ProgressSection } from "@/components/dashboard/ProgressSection";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { readingQuranData, khatamProgressData } from "@/constants/mock-data";

export default function AppDashboard() {
  // Mock flag for fresh login - set to true to see empty states for new user
  const isNewUser = false;

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
            Assalamu&apos;alaikum, User
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            Wednesday, March 5, 2026 • 7 Ramadan 1447 AH
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

      <QuickStats isNewUser={isNewUser} />
      <DailyInspiration />
      <ContinueReading
        readingQuranData={isNewUser ? null : readingQuranData}
        khatamProgressData={isNewUser ? null : khatamProgressData}
      />
      <ProgressSection isNewUser={isNewUser} />
      <RecentActivity isNewUser={isNewUser} />
    </div>
  );
}
