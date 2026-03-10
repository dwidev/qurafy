import { and, asc, desc, eq, gte, lt, lte } from "drizzle-orm";
import { db } from "@/db";
import { khatamPlanProgress, khatamPlans, khatamProgress } from "@/db/schema";
import { getQuranReadListData } from "@/features/read/server/quran-api";
import { QURAN_JUZ_BOUNDARIES } from "@/features/tracker/constants/juz-boundaries";
import { buildStreakSummary, startOfUtcDay, toUtcDateKey } from "@/lib/streaks";
import type {
  CreateKhatamPlanPayload,
  DeleteKhatamPlanPayload,
  KhatamDailyTarget,
  KhatamMeData,
  ToggleKhatamDayPayload,
  UpdateKhatamPlanPayload,
} from "@/features/tracker/types";

const MS_PER_DAY = 86_400_000;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type SurahMeta = {
  n: number;
  en: string;
  verses: number;
};

function dateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(input: Date, days: number) {
  const next = new Date(input);
  next.setUTCDate(next.getUTCDate() + days);
  return startOfUtcDay(next);
}

function daysBetween(startDate: Date, endDate: Date) {
  return Math.floor((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
}

function parseIsoDate(value: string, fieldName: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${fieldName} must use YYYY-MM-DD format.`);
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${fieldName}.`);
  }

  return startOfUtcDay(parsed);
}

function normalizePlanName(name: string) {
  const normalized = name.trim();

  if (normalized.length < 3 || normalized.length > 120) {
    throw new Error("Plan name must be between 3 and 120 characters.");
  }

  return normalized;
}

function normalizeStartJuz(startJuz: number) {
  if (!Number.isInteger(startJuz) || startJuz < 1 || startJuz > 30) {
    throw new Error("Start juz must be between 1 and 30.");
  }

  return startJuz;
}

function computeTotalDays(startDate: Date, targetDate: Date) {
  const totalDays = daysBetween(startDate, targetDate) + 1;

  if (totalDays < 2 || totalDays > 365) {
    throw new Error("Target duration must be between 2 and 365 days.");
  }

  return totalDays;
}

function computeCompletedJuz(startJuz: number, totalDays: number, completedDays: number) {
  const safeTotalDays = Math.max(1, totalDays);
  const safeCompletedDays = Math.max(0, Math.min(completedDays, safeTotalDays));
  const juzLeft = Math.max(1, 30 - (startJuz - 1));
  return Math.min(juzLeft, Math.round((safeCompletedDays / safeTotalDays) * juzLeft));
}

function buildRangeId(startSurahNumber: number, startVerse: number, endSurahNumber: number, endVerse: number) {
  return `range-${startSurahNumber}-${startVerse}-${endSurahNumber}-${endVerse}`;
}

function compareDateKeys(left: string, right: string) {
  return left.localeCompare(right);
}

function getSurahMeta(surahs: SurahMeta[], surahNumber: number) {
  const surah = surahs.find((item) => item.n === surahNumber);

  if (!surah) {
    throw new Error(`Missing surah metadata for surah ${surahNumber}.`);
  }

  return surah;
}

function getRemainingVersesCount(surahs: SurahMeta[], startSurahNumber: number, startVerse: number) {
  return surahs
    .filter((surah) => surah.n >= startSurahNumber)
    .reduce((total, surah) => {
      if (surah.n === startSurahNumber) {
        return total + (surah.verses - startVerse + 1);
      }

      return total + surah.verses;
    }, 0);
}

function advanceVerseCursor(
  surahs: SurahMeta[],
  cursor: { surahNumber: number; verse: number },
  versesCount: number,
) {
  let remaining = versesCount - 1;
  let surahNumber = cursor.surahNumber;
  let verse = cursor.verse;

  while (remaining > 0) {
    const surah = getSurahMeta(surahs, surahNumber);
    const versesLeftInSurah = surah.verses - verse;

    if (remaining <= versesLeftInSurah) {
      verse += remaining;
      remaining = 0;
      break;
    }

    remaining -= versesLeftInSurah + 1;
    surahNumber += 1;
    verse = 1;
  }

  return { surahNumber, verse };
}

function getNextVerseCursor(
  surahs: SurahMeta[],
  cursor: { surahNumber: number; verse: number },
) {
  const surah = getSurahMeta(surahs, cursor.surahNumber);

  if (cursor.verse < surah.verses) {
    return {
      surahNumber: cursor.surahNumber,
      verse: cursor.verse + 1,
    };
  }

  const nextSurah = surahs.find((item) => item.n === cursor.surahNumber + 1);

  if (!nextSurah) {
    return null;
  }

  return {
    surahNumber: nextSurah.n,
    verse: 1,
  };
}

function buildDailyTargets(
  surahs: SurahMeta[],
  startJuz: number,
  startDate: Date,
  targetDate: Date,
  completedDateKeys: string[],
) {
  const startBoundary = QURAN_JUZ_BOUNDARIES.find((item) => item.juz === startJuz);

  if (!startBoundary) {
    throw new Error("Invalid start juz boundary.");
  }

  const totalDays = Math.max(1, daysBetween(startDate, targetDate) + 1);
  const totalVerses = getRemainingVersesCount(surahs, startBoundary.startSurahNumber, startBoundary.startVerse);
  const baseVersesPerDay = Math.floor(totalVerses / totalDays);
  const extraVerses = totalVerses % totalDays;
  const completedSet = new Set(completedDateKeys);
  const todayKey = dateKey(startOfUtcDay(new Date()));
  let currentCursor = {
    surahNumber: startBoundary.startSurahNumber,
    verse: startBoundary.startVerse,
  };

  const dailyTargets: KhatamDailyTarget[] = Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(startDate, index);
    const dateLabel = dateKey(date);
    const versesCount = baseVersesPerDay + (index < extraVerses ? 1 : 0);
    const startCursor = currentCursor;
    const endCursor = advanceVerseCursor(surahs, startCursor, versesCount);
    const startSurah = getSurahMeta(surahs, startCursor.surahNumber);
    const endSurah = getSurahMeta(surahs, endCursor.surahNumber);
    currentCursor = getNextVerseCursor(surahs, endCursor) ?? endCursor;

    return {
      dayNumber: index + 1,
      date: dateLabel,
      startSurahNumber: startCursor.surahNumber,
      startSurahName: startSurah.en,
      startVerse: startCursor.verse,
      endSurahNumber: endCursor.surahNumber,
      endSurahName: endSurah.en,
      endVerse: endCursor.verse,
      versesCount,
      rangeLabel:
        startCursor.surahNumber === endCursor.surahNumber
          ? `${startSurah.en} ${startCursor.surahNumber}:${startCursor.verse}-${endCursor.verse}`
          : `${startSurah.en} ${startCursor.surahNumber}:${startCursor.verse} -> ${endSurah.en} ${endCursor.surahNumber}:${endCursor.verse}`,
      surahLabel:
        startCursor.surahNumber === endCursor.surahNumber
          ? startSurah.en
          : `${startSurah.en} -> ${endSurah.en}`,
      readId: buildRangeId(startCursor.surahNumber, startCursor.verse, endCursor.surahNumber, endCursor.verse),
      isCompleted: completedSet.has(dateLabel),
      isToday: dateLabel === todayKey,
      isPast: compareDateKeys(dateLabel, todayKey) < 0,
    };
  });

  return {
    totalDays,
    totalVerses,
    dailyTargets,
  };
}

async function getDoneDateKeysForRange(tx: Tx, planId: string, startDate: Date, targetDate: Date) {
  const rows = await tx.query.khatamProgress.findMany({
    where: and(
      eq(khatamProgress.planId, planId),
      eq(khatamProgress.isDone, true),
      gte(khatamProgress.date, startDate),
      lte(khatamProgress.date, targetDate),
    ),
    orderBy: [asc(khatamProgress.date)],
  });

  return Array.from(new Set(rows.map((row) => toUtcDateKey(row.date))));
}

async function syncPlanSummary(
  tx: Tx,
  plan: { id: string; startJuz: number; startDate: Date; targetDate: Date },
) {
  const totalDays = Math.max(1, daysBetween(startOfUtcDay(plan.startDate), startOfUtcDay(plan.targetDate)) + 1);
  const completedDateKeys = await getDoneDateKeysForRange(
    tx,
    plan.id,
    startOfUtcDay(plan.startDate),
    startOfUtcDay(plan.targetDate),
  );
  const completedDays = completedDateKeys.length;
  const completedJuz = computeCompletedJuz(plan.startJuz, totalDays, completedDays);
  const streakSummary = buildStreakSummary(completedDateKeys);
  const isCompleted = completedDays >= totalDays;

  await tx
    .insert(khatamPlanProgress)
    .values({
      planId: plan.id,
      completedDays,
      completedJuz,
      currentStreak: streakSummary.currentStreak,
      bestStreak: streakSummary.bestStreak,
      lastCompletedAt: streakSummary.lastCompletedAt,
    })
    .onConflictDoUpdate({
      target: khatamPlanProgress.planId,
      set: {
        completedDays,
        completedJuz,
        currentStreak: streakSummary.currentStreak,
        bestStreak: streakSummary.bestStreak,
        lastCompletedAt: streakSummary.lastCompletedAt,
      },
    });

  await tx
    .update(khatamPlans)
    .set({ isCompleted })
    .where(eq(khatamPlans.id, plan.id));

  return {
    completedDays,
    completedJuz,
    currentStreak: streakSummary.currentStreak,
    bestStreak: streakSummary.bestStreak,
    isCompleted,
    totalDays,
  };
}

export async function getKhatamMeData(userId: string): Promise<KhatamMeData> {
  const activePlan = await db.query.khatamPlans.findFirst({
    where: and(eq(khatamPlans.userId, userId), eq(khatamPlans.isCompleted, false)),
    orderBy: [desc(khatamPlans.targetDate)],
  });

  if (!activePlan) {
    return {
      activePlan: null,
    };
  }

  const startDate = startOfUtcDay(activePlan.startDate);
  const targetDate = startOfUtcDay(activePlan.targetDate);
  const progressRows = await db.query.khatamProgress.findMany({
    where: and(
      eq(khatamProgress.planId, activePlan.id),
      eq(khatamProgress.isDone, true),
      gte(khatamProgress.date, startDate),
      lte(khatamProgress.date, targetDate),
    ),
    orderBy: [desc(khatamProgress.date)],
  });

  const completedDays = Array.from(new Set(progressRows.map((row) => dateKey(startOfUtcDay(row.date))))).sort();
  const streakSummary = buildStreakSummary(completedDays);
  const quranList = await getQuranReadListData().catch(() => null);
  const schedule = quranList
    ? buildDailyTargets(
        quranList.surahs.map((surah) => ({
          n: surah.n,
          en: surah.en,
          verses: surah.verses,
        })),
        activePlan.startJuz,
        startDate,
        targetDate,
        completedDays,
      )
    : {
        totalVerses: 0,
        totalDays: Math.max(1, daysBetween(startDate, targetDate) + 1),
        dailyTargets: [],
      };

  return {
    activePlan: {
      id: activePlan.id,
      name: activePlan.name,
      startJuz: activePlan.startJuz,
      startDate: dateKey(startDate),
      targetDate: dateKey(targetDate),
      completedDays,
      currentStreak: streakSummary.currentStreak,
      bestStreak: streakSummary.bestStreak,
      totalVerses: schedule.totalVerses,
      totalDays: schedule.totalDays,
      dailyTargets: schedule.dailyTargets,
    },
  };
}

export async function createKhatamPlan(userId: string, payload: CreateKhatamPlanPayload) {
  const normalizedName = normalizePlanName(payload.name);
  const startJuz = normalizeStartJuz(payload.startJuz);
  const startDate = startOfUtcDay(new Date());
  const targetDate = parseIsoDate(payload.targetDate, "targetDate");

  if (targetDate <= startDate) {
    throw new Error("Target date must be at least one day after today.");
  }

  computeTotalDays(startDate, targetDate);

  const createdPlan = await db.transaction(async (tx) => {
    await tx
      .update(khatamPlans)
      .set({ isCompleted: true })
      .where(and(eq(khatamPlans.userId, userId), eq(khatamPlans.isCompleted, false)));

    const [newPlan] = await tx
      .insert(khatamPlans)
      .values({
        userId,
        name: normalizedName,
        startJuz,
        startDate,
        targetDate,
        isCompleted: false,
      })
      .returning({
        id: khatamPlans.id,
      });

    if (!newPlan) {
      throw new Error("Unable to create khatam plan.");
    }

    await tx
      .insert(khatamPlanProgress)
      .values({
        planId: newPlan.id,
        completedDays: 0,
        completedJuz: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastCompletedAt: null,
      })
      .onConflictDoNothing({ target: khatamPlanProgress.planId });

    return newPlan;
  });

  return {
    planId: createdPlan.id,
  };
}

export async function updateKhatamPlan(userId: string, payload: UpdateKhatamPlanPayload) {
  const normalizedName = normalizePlanName(payload.name);
  const targetDate = parseIsoDate(payload.targetDate, "targetDate");

  const activePlan = await db.query.khatamPlans.findFirst({
    where: and(
      eq(khatamPlans.id, payload.planId),
      eq(khatamPlans.userId, userId),
      eq(khatamPlans.isCompleted, false),
    ),
  });

  if (!activePlan) {
    throw new Error("Active plan not found.");
  }

  const startDate = startOfUtcDay(activePlan.startDate);

  if (targetDate <= startDate) {
    throw new Error("Target date must be after plan start date.");
  }

  computeTotalDays(startDate, targetDate);

  await db.transaction(async (tx) => {
    await tx
      .update(khatamPlans)
      .set({
        name: normalizedName,
        targetDate,
      })
      .where(eq(khatamPlans.id, activePlan.id));

    await tx
      .delete(khatamProgress)
      .where(
        and(
          eq(khatamProgress.planId, activePlan.id),
          gte(khatamProgress.date, addDays(targetDate, 1)),
        ),
      );

    await syncPlanSummary(tx, {
      id: activePlan.id,
      startJuz: activePlan.startJuz,
      startDate,
      targetDate,
    });
  });

  return {
    updated: true,
  };
}

export async function deleteKhatamPlan(userId: string, payload: DeleteKhatamPlanPayload) {
  if (!payload.planId) {
    throw new Error("Plan id is required.");
  }

  const plan = await db.query.khatamPlans.findFirst({
    where: and(eq(khatamPlans.id, payload.planId), eq(khatamPlans.userId, userId)),
  });

  if (!plan) {
    throw new Error("Plan not found.");
  }

  await db.delete(khatamPlans).where(eq(khatamPlans.id, payload.planId));

  return {
    deleted: true,
  };
}

export async function toggleKhatamToday(userId: string, payload: ToggleKhatamDayPayload) {
  if (!payload.planId) {
    throw new Error("Plan id is required.");
  }

  const plan = await db.query.khatamPlans.findFirst({
    where: and(
      eq(khatamPlans.id, payload.planId),
      eq(khatamPlans.userId, userId),
      eq(khatamPlans.isCompleted, false),
    ),
  });

  if (!plan) {
    throw new Error("Active plan not found.");
  }

  const startDate = startOfUtcDay(plan.startDate);
  const targetDate = startOfUtcDay(plan.targetDate);
  const today = startOfUtcDay(new Date());
  const progressDate = payload.scheduledDate
    ? parseIsoDate(payload.scheduledDate, "scheduledDate")
    : today;

  if (progressDate < startDate || progressDate > targetDate) {
    throw new Error("This target is outside the plan schedule.");
  }

  const dayEnd = addDays(progressDate, 1);

  const result = await db.transaction(async (tx) => {
    const existing = await tx.query.khatamProgress.findFirst({
      where: and(
        eq(khatamProgress.planId, plan.id),
        gte(khatamProgress.date, progressDate),
        lt(khatamProgress.date, dayEnd),
      ),
      orderBy: [desc(khatamProgress.date)],
    });

    const nextIsDone = payload.forceDone ? true : !(existing?.isDone ?? false);
    const nextCompletedVerses = nextIsDone
      ? Math.max(0, Math.floor(payload.completedVerses ?? existing?.completedVerses ?? 0))
      : 0;

    if (existing) {
      if (existing.isDone !== nextIsDone || existing.completedVerses !== nextCompletedVerses) {
        await tx
          .update(khatamProgress)
          .set({ isDone: nextIsDone, date: progressDate, completedVerses: nextCompletedVerses })
          .where(eq(khatamProgress.id, existing.id));
      }
    } else {
      await tx.insert(khatamProgress).values({
        planId: plan.id,
        date: progressDate,
        isDone: true,
        completedVerses: nextCompletedVerses,
      });
    }

    const summary = await syncPlanSummary(tx, {
      id: plan.id,
      startJuz: plan.startJuz,
      startDate,
      targetDate,
    });

    return {
      isDone: nextIsDone,
      completedDays: summary.completedDays,
      isPlanCompleted: summary.isCompleted,
    };
  });

  return {
    completed: true,
    isDone: result.isDone,
    completedDays: result.completedDays,
    isPlanCompleted: result.isPlanCompleted,
  };
}
