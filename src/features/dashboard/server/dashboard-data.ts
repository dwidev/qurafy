import { unstable_cache } from "next/cache";
import { dailyVerseQuotes } from "@/features/dashboard/constants/daily-verses";
import { getMemorizeMeData } from "@/features/memorize/server/memorize-data";
import { getProfileStats } from "@/features/profile/server/profile-stats";
import { getQuranReadContentData } from "@/features/read/server/quran-api";
import { getKhatamMeData } from "@/features/tracker/server/khatam-data";
import type { DashboardViewData } from "@/features/dashboard/types";

function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
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

function formatDateFromKey(dateKey: string) {
  return formatDateShort(new Date(`${dateKey}T00:00:00.000Z`));
}

function getPrimaryKhatamTarget(
  activePlan: NonNullable<Awaited<ReturnType<typeof getKhatamMeData>>["activePlan"]>,
) {
  const todayTarget = activePlan.dailyTargets.find((target) => target.isToday) ?? null;
  const nextUpcomingTarget =
    activePlan.dailyTargets.find((target) => !target.isCompleted && !target.isPast && !target.isToday) ?? null;

  return todayTarget && !todayTarget.isCompleted
    ? todayTarget
    : nextUpcomingTarget ?? todayTarget ?? activePlan.dailyTargets.at(-1) ?? null;
}

export async function getDashboardViewDataUncached(userId: string): Promise<DashboardViewData> {
  const now = new Date();
  const [stats, memorizeData, khatamData] = await Promise.all([
    getProfileStats(userId),
    getMemorizeMeData(userId),
    getKhatamMeData(userId),
  ]);
  const activeGoal = memorizeData.activeGoal;
  const activePlan = khatamData.activePlan;
  const isNewUser = !activeGoal && !activePlan;

  const totalMinutesRead = stats.totalVersesRead * 2;
  const quickStats = {
    streakDays: stats.currentStreak,
    timeReadLabel: isNewUser ? "0h 0m" : formatReadTime(totalMinutesRead),
    versesRead: stats.totalVersesRead,
    weeklyGoalPct: isNewUser ? 0 : Math.min(100, Math.max(5, Math.round((stats.totalVersesRead / 100) * 100))),
  };

  let memorizationCard: DashboardViewData["memorizationCard"] = null;
  let memorizationReadingData: DashboardViewData["memorizationReadingData"] = null;

  if (activeGoal) {
    const todayTarget = activeGoal.todayTarget;
    const memorizationArabic = todayTarget ? buildArabicExcerpt(todayTarget.verses) : "";

    memorizationCard = {
      title: activeGoal.title,
      subtitle: `Surah ${activeGoal.surahNumber}`,
      progressPct: activeGoal.progressPct,
      targetLabel: `Goal: ${activeGoal.targetDays} days`,
      statusLabel: `${activeGoal.completedVerses}/${activeGoal.totalVerses} verses`,
      stateLabel: "Active Target",
    };

    memorizationReadingData = {
      readingType: "memorization",
      surah: activeGoal.title,
      verse: todayTarget
        ? `Surah ${activeGoal.surahNumber} • Day ${todayTarget.dayNumber} • ${formatVerseRange(todayTarget.startVerse, todayTarget.endVerse)}`
        : `Surah ${activeGoal.surahNumber} • Today's target completed`,
      arabic: memorizationArabic || activeGoal.surahArabicName || "وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا",
      link: todayTarget ? "/app/memorize/session" : "/app/memorize",
    };
  }

  let khatamCard: DashboardViewData["khatamCard"] = null;
  let khatamReadingData: DashboardViewData["khatamReadingData"] = null;

  if (activePlan) {
    const completedDays = activePlan.completedDays.length;
    const progressPct = Math.min(100, Math.max(0, Math.round((completedDays / activePlan.totalDays) * 100)));
    const primaryTarget = getPrimaryKhatamTarget(activePlan);
    const khatamContent = primaryTarget ? await getQuranReadContentData(primaryTarget.readId).catch(() => null) : null;
    const khatamArabic = khatamContent ? buildArabicExcerpt(khatamContent.verses) : "";

    khatamCard = {
      title: activePlan.name,
      subtitle: `Start Juz ${activePlan.startJuz}`,
      progressPct,
      targetLabel: `Target: ${activePlan.totalDays} days`,
      statusLabel: `${completedDays} / ${activePlan.totalDays} days done`,
    };

    khatamReadingData = {
      readingType: "khatam",
      surah: activePlan.name,
      verse: primaryTarget
        ? `${primaryTarget.rangeLabel} • ${primaryTarget.isToday ? "Today's target" : formatDateFromKey(primaryTarget.date)}`
        : `Start Juz ${activePlan.startJuz} • Due ${formatDateFromKey(activePlan.targetDate)}`,
      arabic: khatamArabic || "فَٱقْرَءُوا۟ مَا تَيَسَّرَ مِنَ ٱلْقُرْءَانِ",
      link: primaryTarget
        ? `/app/read/${primaryTarget.readId}?khatam=true&planId=${activePlan.id}&scheduledDate=${primaryTarget.date}&returnTo=/app/tracker`
        : "/app/tracker",
    };
  }

  const recentItems = [
    ...(activeGoal
      ? [
        {
          surah: activeGoal.title,
          verse: activeGoal.todayTarget
            ? `Day ${activeGoal.todayTarget.dayNumber} memorization ready`
            : "Today's memorization completed",
          time: "Memorization",
        },
      ]
      : []),
    ...(activePlan
      ? [
        {
          surah: activePlan.name,
          verse: `Khatam from Juz ${activePlan.startJuz}`,
          time: `Target ${formatDateFromKey(activePlan.targetDate)}`,
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

  const dateInfo = {
    gregorian: formatGregorianDate(now),
    hijri: formatHijriDate(now),
  };
  const dailyVerse = getDailyVerse(now);

  return {
    isNewUser,
    dateInfo,
    dailyVerse,
    quickStats,
    memorizationReadingData,
    khatamReadingData,
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
