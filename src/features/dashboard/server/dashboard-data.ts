import { and, desc, eq, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { khatamPlanProgress, khatamPlans, memorizationGoals, memorizationProgress } from "@/db/schema";
import { dailyVerseQuotes } from "@/features/dashboard/constants/daily-verses";
import { getProfileStats } from "@/features/profile/server/profile-stats";
import { getQuranReadContentData } from "@/features/read/server/quran-api";
import type { DashboardViewData } from "@/features/dashboard/types";

function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function clampPositive(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }

  return Math.floor(value);
}

function buildDailyTargets(totalVerses: number, targetDays: number) {
  const safeVerses = clampPositive(totalVerses);
  const safeTargetDays = clampPositive(targetDays);
  const effectiveDays = Math.min(safeTargetDays, safeVerses);
  const baseVersesPerDay = Math.floor(safeVerses / effectiveDays);
  const extraVerses = safeVerses % effectiveDays;
  let startVerse = 1;

  return Array.from({ length: effectiveDays }, (_, index) => {
    const versesCount = baseVersesPerDay + (index < extraVerses ? 1 : 0);
    const endVerse = startVerse + versesCount - 1;
    const target = {
      dayNumber: index + 1,
      startVerse,
      endVerse,
      versesCount,
    };

    startVerse = endVerse + 1;
    return target;
  });
}

function formatVerseRange(startVerse: number, endVerse: number) {
  if (startVerse === endVerse) {
    return `Verse ${startVerse}`;
  }

  return `Verses ${startVerse}-${endVerse}`;
}

function buildArabicExcerpt(verses: Array<{ ar: string }>, limit = 2) {
  return verses
    .map((verse) => verse.ar.trim())
    .filter((verse) => verse.length > 0)
    .slice(0, limit)
    .join(" ۝ ");
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
  const [stats, activeGoal, latestCompletedGoal, activePlan] = await Promise.all([
    getProfileStats(userId),
    db.query.memorizationGoals.findFirst({
      where: and(
        eq(memorizationGoals.userId, userId),
        eq(memorizationGoals.status, "active"),
        isNull(memorizationGoals.deletedAt),
      ),
      orderBy: [desc(memorizationGoals.id)],
    }),
    db.query.memorizationGoals.findFirst({
      where: and(
        eq(memorizationGoals.userId, userId),
        eq(memorizationGoals.status, "completed"),
        isNull(memorizationGoals.deletedAt),
      ),
      orderBy: [desc(memorizationGoals.id)],
    }),
    db.query.khatamPlans.findFirst({
      where: and(
        eq(khatamPlans.userId, userId),
        eq(khatamPlans.isCompleted, false),
        isNull(khatamPlans.deletedAt),
      ),
      orderBy: [desc(khatamPlans.targetDate)],
    }),
  ]);
  const latestMemorizationGoal = activeGoal ?? latestCompletedGoal ?? null;

  const isNewUser =
    stats.totalVersesRead === 0 &&
    stats.completedKhatam === 0 &&
    stats.activeGoals === 0 &&
    !latestMemorizationGoal &&
    !activePlan;

  const dateInfo = {
    gregorian: formatGregorianDate(now),
    hijri: formatHijriDate(now),
  };
  const dailyVerse = getDailyVerse(now);

  const totalMinutesRead = stats.totalVersesRead * 2;
  const quickStats = {
    streakDays: isNewUser ? 0 : stats.estimatedStreakDays,
    timeReadLabel: isNewUser ? "0h 0m" : formatReadTime(totalMinutesRead),
    versesRead: stats.totalVersesRead,
    weeklyGoalPct: isNewUser ? 0 : Math.min(100, Math.max(5, Math.round((stats.totalVersesRead / 100) * 100))),
  };

  let memorizationCard: DashboardViewData["memorizationCard"] = null;
  const readingQuranData: DashboardViewData["readingQuranData"] = null;
  let khatamProgressData: DashboardViewData["khatamProgressData"] = null;

  if (latestMemorizationGoal) {
    const latestGoalProgress = await db.query.memorizationProgress.findFirst({
      where: eq(memorizationProgress.goalId, latestMemorizationGoal.id),
    });

    const totalGoalVerses = Math.max(latestMemorizationGoal.totalVerses, 1);
    const completedGoalVerses = Math.min(totalGoalVerses, latestGoalProgress?.completedVerses ?? 0);
    const progressPct = Math.min(100, Math.round((completedGoalVerses / totalGoalVerses) * 100));
    const isCompletedGoal = latestMemorizationGoal.status === "completed";
    const dailyTargets = buildDailyTargets(totalGoalVerses, latestMemorizationGoal.targetDays);
    const completedDays = Math.max(0, Math.min(latestGoalProgress?.completedDays ?? 0, dailyTargets.length));
    const nextTarget = dailyTargets[completedDays] ?? null;
    const lastTarget = dailyTargets.at(-1) ?? null;
    const displayTarget = nextTarget ?? lastTarget;
    const memorizationContent = await getQuranReadContentData(`surah-${latestMemorizationGoal.surahNumber}`).catch(() => null);
    const memorizationArabic = displayTarget && memorizationContent
      ? buildArabicExcerpt(
        memorizationContent.verses.filter(
          (verse) => verse.n >= displayTarget.startVerse && verse.n <= displayTarget.endVerse,
        ),
      )
      : "";

    memorizationCard = {
      title: latestMemorizationGoal.title,
      subtitle: `Surah ${latestMemorizationGoal.surahNumber}`,
      progressPct,
      targetLabel: isCompletedGoal
        ? `Completed in ${latestMemorizationGoal.targetDays} days`
        : `Goal: ${latestMemorizationGoal.targetDays} days`,
      statusLabel: `${completedGoalVerses}/${totalGoalVerses} verses`,
      stateLabel: isCompletedGoal ? "Completed Goal" : "Active Target",
    };

    khatamProgressData = {
      surah: latestMemorizationGoal.title,
      verse: displayTarget
        ? isCompletedGoal
          ? `Surah ${latestMemorizationGoal.surahNumber} • Completed ${formatVerseRange(displayTarget.startVerse, displayTarget.endVerse)}`
          : `Surah ${latestMemorizationGoal.surahNumber} • Next ${formatVerseRange(displayTarget.startVerse, displayTarget.endVerse)}`
        : `Surah ${latestMemorizationGoal.surahNumber} • Active memorization`,
      arabic: memorizationArabic || "وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا",
      link: "/app/memorize",
    };
  }

  let khatamCard: DashboardViewData["khatamCard"] = null;

  if (activePlan) {
    const totalDays = Math.max(1, daysBetween(activePlan.startDate, activePlan.targetDate) + 1);
    const planProgress = await db.query.khatamPlanProgress.findFirst({
      where: eq(khatamPlanProgress.planId, activePlan.id),
    });
    const completedDays = Math.max(0, Math.min(totalDays, planProgress?.completedDays ?? 0));
    const progressPct = Math.min(100, Math.max(0, Math.round((completedDays / totalDays) * 100)));
    const khatamContent = await getQuranReadContentData(`juz-${activePlan.startJuz}`).catch(() => null);
    const khatamArabic = khatamContent ? buildArabicExcerpt(khatamContent.verses) : "";

    khatamCard = {
      title: activePlan.name,
      subtitle: `Start Juz ${activePlan.startJuz}`,
      progressPct,
      targetLabel: `Target: ${totalDays} days`,
      statusLabel: `${completedDays} / ${totalDays} days done`,
    };

    khatamProgressData = {
      surah: activePlan.name,
      verse: `Start Juz ${activePlan.startJuz} • Due ${formatDateShort(activePlan.targetDate)}`,
      arabic: khatamArabic || "فَٱقْرَءُوا۟ مَا تَيَسَّرَ مِنَ ٱلْقُرْءَانِ",
      link: "/app/tracker",
    };
  }

  const recentItems = [
    ...(latestMemorizationGoal
      ? [
        {
          surah: latestMemorizationGoal.title,
          verse:
            latestMemorizationGoal.status === "completed"
              ? `Surah ${latestMemorizationGoal.surahNumber} memorization completed`
              : `Surah ${latestMemorizationGoal.surahNumber} memorization active`,
          time: latestMemorizationGoal.status === "completed" ? "Completed goal" : "Active goal",
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
    ...(stats.totalVersesRead > 0
      ? [
        {
          surah: "Reading Progress",
          verse: `${stats.totalVersesRead} verses completed`,
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
