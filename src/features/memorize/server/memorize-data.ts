import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { memorizationGoals, memorizationProgress } from "@/db/schema";
import { getQuranReadContentData, getQuranReadListData } from "@/features/read/server/quran-api";
import type {
  CompleteMemorizeSessionPayload,
  CreateMemorizeGoalPayload,
  MemorizeActiveGoal,
  MemorizeMeData,
} from "@/features/memorize/types";

function buildRangeLabel(surahName: string, startVerse: number, endVerse: number) {
  if (startVerse === endVerse) {
    return `${surahName}, Verse ${startVerse}`;
  }

  return `${surahName}, Verses ${startVerse}-${endVerse}`;
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
      isCompleted: false,
    };

    startVerse = endVerse + 1;
    return target;
  });
}

export async function getMemorizeMeData(userId: string): Promise<MemorizeMeData> {
  const [quranList, activeGoalRow] = await Promise.all([
    getQuranReadListData(),
    db.query.memorizationGoals.findFirst({
      where: and(eq(memorizationGoals.userId, userId), eq(memorizationGoals.status, "active")),
      orderBy: [desc(memorizationGoals.id)],
    }),
  ]);

  const surahs = quranList.surahs.map((surah) => ({
    n: surah.n,
    en: surah.en,
    ar: surah.ar,
    verses: surah.verses,
  }));

  if (!activeGoalRow) {
    return {
      surahs,
      activeGoal: null,
    };
  }

  const surahMeta = surahs.find((item) => item.n === activeGoalRow.surahNumber);
  const surahData = await getQuranReadContentData(`surah-${activeGoalRow.surahNumber}`);

  if (!surahMeta || !surahData) {
    return {
      surahs,
      activeGoal: null,
    };
  }

  const progressRows = await db
    .select({
      dayNumber: memorizationProgress.dayNumber,
      startVerse: memorizationProgress.startVerse,
      endVerse: memorizationProgress.endVerse,
      versesCount: memorizationProgress.versesCount,
      isCompleted: memorizationProgress.isCompleted,
    })
    .from(memorizationProgress)
    .where(eq(memorizationProgress.goalId, activeGoalRow.id))
    .orderBy(asc(memorizationProgress.dayNumber));

  const plannedRows = progressRows.length > 0 ? progressRows : buildDailyTargets(surahMeta.verses, activeGoalRow.targetDays);
  const totalVerses = Math.max(
    plannedRows.reduce((sum, row) => sum + Math.max(0, row.versesCount), 0),
    surahMeta.verses,
    1,
  );
  const completedVerses = plannedRows.reduce(
    (sum, row) => sum + (row.isCompleted ? Math.max(0, row.versesCount) : 0),
    0,
  );

  const todayIndex = plannedRows.findIndex((row) => !row.isCompleted);
  const hasPendingDay = todayIndex >= 0;
  const todayRow = hasPendingDay ? plannedRows[todayIndex] : null;
  const passedDays = todayRow
    ? Math.max(1, Math.min(activeGoalRow.targetDays, todayRow.dayNumber))
    : Math.max(1, Math.min(activeGoalRow.targetDays, plannedRows.length));
  const remainingDays = Math.max(0, activeGoalRow.targetDays - passedDays);
  const progressPct = Math.min(100, Math.round((completedVerses / totalVerses) * 100));

  let todayTarget: MemorizeActiveGoal["todayTarget"] = null;

  if (todayRow) {
    const verses = surahData.verses.filter(
      (verse) => verse.n >= todayRow.startVerse && verse.n <= todayRow.endVerse,
    );

    todayTarget = {
      dayNumber: todayRow.dayNumber,
      startVerse: todayRow.startVerse,
      endVerse: todayRow.endVerse,
      verses,
      isCompleted: todayRow.isCompleted,
    };
  }

  const upcomingTargets = hasPendingDay
    ? plannedRows.slice(todayIndex + 1, todayIndex + 4).map((row) => ({
        dayLabel: `Day ${row.dayNumber}`,
        rangeLabel: buildRangeLabel(surahMeta.en, row.startVerse, row.endVerse),
        count: row.versesCount,
      }))
    : [];

  const dailyTargetCount = todayRow
    ? todayRow.versesCount
    : Math.max(1, Math.ceil(totalVerses / clampPositive(activeGoalRow.targetDays)));

  return {
    surahs,
    activeGoal: {
      id: activeGoalRow.id,
      title: activeGoalRow.title,
      surahNumber: activeGoalRow.surahNumber,
      surahName: surahMeta.en,
      surahArabicName: surahMeta.ar,
      targetDays: activeGoalRow.targetDays,
      repsPerVerse: activeGoalRow.repsPerVerse,
      totalVerses,
      completedVerses,
      progressPct,
      passedDays,
      remainingDays,
      dailyTargetCount,
      todayTarget,
      upcomingTargets,
    },
  };
}

export async function createMemorizeGoal(userId: string, payload: CreateMemorizeGoalPayload) {
  const normalizedTitle = payload.title.trim();
  const targetDays = clampPositive(payload.targetDays);
  const repsPerVerse = clampPositive(payload.repsPerVerse);

  if (normalizedTitle.length < 3 || normalizedTitle.length > 120) {
    throw new Error("Title must be between 3 and 120 characters.");
  }

  if (!Number.isInteger(payload.surahNumber) || payload.surahNumber < 1 || payload.surahNumber > 114) {
    throw new Error("Surah number must be between 1 and 114.");
  }

  if (targetDays < 7 || targetDays > 365) {
    throw new Error("Target days must be between 7 and 365.");
  }

  if (repsPerVerse < 1 || repsPerVerse > 10) {
    throw new Error("Repetitions must be between 1 and 10.");
  }

  const quranList = await getQuranReadListData();
  const surah = quranList.surahs.find((item) => item.n === payload.surahNumber);

  if (!surah) {
    throw new Error("Selected surah is not available.");
  }

  const createdGoalId = await db.transaction(async (tx) => {
    await tx
      .update(memorizationGoals)
      .set({ status: "completed" })
      .where(and(eq(memorizationGoals.userId, userId), eq(memorizationGoals.status, "active")));

    const [createdGoal] = await tx
      .insert(memorizationGoals)
      .values({
        userId,
        title: normalizedTitle,
        surahNumber: payload.surahNumber,
        targetDays,
        repsPerVerse,
        status: "active",
      })
      .returning({ id: memorizationGoals.id });

    if (!createdGoal) {
      throw new Error("Unable to create goal.");
    }

    const progressRows = buildDailyTargets(surah.verses, targetDays).map((target) => ({
      goalId: createdGoal.id,
      dayNumber: target.dayNumber,
      startVerse: target.startVerse,
      endVerse: target.endVerse,
      versesCount: target.versesCount,
      isCompleted: false,
    }));

    if (progressRows.length > 0) {
      await tx.insert(memorizationProgress).values(progressRows);
    }

    return createdGoal.id;
  });

  return {
    goalId: createdGoalId,
  };
}

export async function completeMemorizeSession(userId: string, payload: CompleteMemorizeSessionPayload) {
  const dayNumber = Number(payload.dayNumber);

  if (!payload.goalId || !Number.isInteger(dayNumber) || dayNumber <= 0) {
    throw new Error("Goal id and day number are required.");
  }

  const goal = await db.query.memorizationGoals.findFirst({
    where: and(eq(memorizationGoals.id, payload.goalId), eq(memorizationGoals.userId, userId)),
  });

  if (!goal) {
    throw new Error("Goal not found.");
  }

  const updatedRows = await db
    .update(memorizationProgress)
    .set({ isCompleted: true })
    .where(and(eq(memorizationProgress.goalId, payload.goalId), eq(memorizationProgress.dayNumber, dayNumber)))
    .returning({ id: memorizationProgress.id });

  if (updatedRows.length === 0) {
    throw new Error("Day target not found.");
  }

  const [remainingRow] = await db
    .select({ total: sql<number>`count(*)` })
    .from(memorizationProgress)
    .where(and(eq(memorizationProgress.goalId, payload.goalId), eq(memorizationProgress.isCompleted, false)));

  const remaining = Number(remainingRow?.total ?? 0);

  if (remaining === 0) {
    await db
      .update(memorizationGoals)
      .set({ status: "completed" })
      .where(eq(memorizationGoals.id, payload.goalId));
  }

  return {
    completed: true,
    isGoalCompleted: remaining === 0,
  };
}
