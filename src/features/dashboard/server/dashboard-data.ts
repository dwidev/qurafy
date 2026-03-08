import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { khatamPlans, memorizationGoals, memorizationProgress } from "@/db/schema";
import { dailyVerseQuotes } from "@/features/dashboard/constants/daily-verses";
import { getProfileStats } from "@/features/profile/server/profile-stats";
import type { DashboardViewData } from "@/features/dashboard/types";

function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function formatReadTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function daysBetween(startDate: Date, endDate: Date) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.floor((end.getTime() - start.getTime()) / 86_400_000);
}

function formatGregorianDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatHijriDate(date: Date) {
  return new Intl.DateTimeFormat("en-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getDailyVerse(date: Date) {
  const daySeed = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
  const index = ((daySeed % dailyVerseQuotes.length) + dailyVerseQuotes.length) % dailyVerseQuotes.length;
  return dailyVerseQuotes[index];
}

async function getDashboardViewDataUncached(userId: string): Promise<DashboardViewData> {
  const now = new Date();
  const [stats, activeGoal, activePlan] = await Promise.all([
    getProfileStats(userId),
    db.query.memorizationGoals.findFirst({
      where: and(eq(memorizationGoals.userId, userId), eq(memorizationGoals.status, "active")),
      orderBy: [desc(memorizationGoals.id)],
    }),
    db.query.khatamPlans.findFirst({
      where: and(eq(khatamPlans.userId, userId), eq(khatamPlans.isCompleted, false)),
      orderBy: [desc(khatamPlans.targetDate)],
    }),
  ]);

  const isNewUser =
    stats.completedVerses === 0 &&
    stats.completedKhatam === 0 &&
    stats.activeGoals === 0 &&
    !activeGoal &&
    !activePlan;

  const dateInfo = {
    gregorian: formatGregorianDate(now),
    hijri: formatHijriDate(now),
  };
  const dailyVerse = getDailyVerse(now);

  const totalMinutesRead = stats.completedVerses * 2;
  const quickStats = {
    streakDays: isNewUser ? 0 : stats.estimatedStreakDays,
    timeReadLabel: isNewUser ? "0h 0m" : formatReadTime(totalMinutesRead),
    versesRead: stats.completedVerses,
    weeklyGoalPct: isNewUser ? 0 : Math.min(100, Math.max(5, Math.round((stats.completedVerses / 100) * 100))),
  };

  let memorizationCard: DashboardViewData["memorizationCard"] = null;
  let readingQuranData: DashboardViewData["readingQuranData"] = null;

  if (activeGoal) {
    const activeGoalProgress = await db.query.memorizationProgress.findFirst({
      where: eq(memorizationProgress.goalId, activeGoal.id),
    });

    const totalGoalVerses = Math.max(activeGoal.totalVerses, 1);
    const completedGoalVerses = Math.min(totalGoalVerses, activeGoalProgress?.completedVerses ?? 0);
    const progressPct = Math.min(100, Math.round((completedGoalVerses / totalGoalVerses) * 100));

    memorizationCard = {
      title: activeGoal.title,
      subtitle: `Surah ${activeGoal.surahNumber}`,
      progressPct,
      targetLabel: `Goal: ${activeGoal.targetDays} days`,
      statusLabel: `${completedGoalVerses}/${totalGoalVerses} verses`,
    };

    readingQuranData = {
      surah: activeGoal.title,
      verse: `Surah ${activeGoal.surahNumber} • Active memorization`,
      arabic: "وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا",
      link: "/app/memorize",
    };
  }

  let khatamCard: DashboardViewData["khatamCard"] = null;
  let khatamProgressData: DashboardViewData["khatamProgressData"] = null;

  if (activePlan) {
    const totalDays = Math.max(1, daysBetween(activePlan.startDate, activePlan.targetDate) + 1);
    const elapsedDays = Math.max(0, Math.min(totalDays, daysBetween(activePlan.startDate, now) + 1));
    const progressPct = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

    khatamCard = {
      title: activePlan.name,
      subtitle: `Start Juz ${activePlan.startJuz}`,
      progressPct,
      targetLabel: `Target: ${totalDays} days`,
      statusLabel: `Day ${Math.max(1, elapsedDays)} of ${totalDays}`,
    };

    khatamProgressData = {
      surah: activePlan.name,
      verse: `Start Juz ${activePlan.startJuz} • Due ${formatDateShort(activePlan.targetDate)}`,
      arabic: "فَٱقْرَءُوا۟ مَا تَيَسَّرَ مِنَ ٱلْقُرْءَانِ",
      link: "/app/tracker",
    };
  }

  const recentItems = [
    ...(activeGoal
      ? [
          {
            surah: activeGoal.title,
            verse: `Surah ${activeGoal.surahNumber} memorization active`,
            time: "Active goal",
          },
        ]
      : []),
    ...(activePlan
      ? [
          {
            surah: activePlan.name,
            verse: `Khatam from Juz ${activePlan.startJuz}`,
            time: `Target ${formatDateShort(activePlan.targetDate)}`,
          },
        ]
      : []),
    ...(stats.completedVerses > 0
      ? [
          {
            surah: "Memorization Progress",
            verse: `${stats.completedVerses} verses completed`,
            time: "Latest stats",
          },
        ]
      : []),
  ];

  return {
    isNewUser,
    dateInfo,
    dailyVerse,
    quickStats,
    readingQuranData,
    khatamProgressData,
    memorizationCard,
    khatamCard,
    recentItems,
  };
}

export async function getDashboardViewData(userId: string): Promise<DashboardViewData> {
  return unstable_cache(
    async () => getDashboardViewDataUncached(userId),
    ["dashboard-view-data", userId],
    {
      revalidate: 60,
      tags: [`dashboard-view-data:${userId}`],
    },
  )();
}
