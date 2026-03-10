import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import { memorizationDayCompletions, memorizationGoals, memorizationProgress } from "@/db/schema";
import { getQuranReadContentData, getQuranReadListData } from "@/features/read/server/quran-api";
import { addUtcDays, buildStreakSummary, startOfUtcDay, toUtcDateKey } from "@/lib/streaks";
import type {
  CompleteMemorizeSessionPayload,
  CreateMemorizeGoalPayload,
  DeleteMemorizeGoalPayload,
  MemorizeActiveGoal,
  MemorizeMeData,
} from "@/features/memorize/types";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

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

function buildPlannedRows(targets: ReturnType<typeof buildDailyTargets>, completedDaysCount: number) {
  return targets.map((target) => ({
    ...target,
    isCompleted: target.dayNumber <= completedDaysCount,
  }));
}

async function getGoalCompletionDateKeys(tx: Tx, goalId: string) {
  const rows = await tx.query.memorizationDayCompletions.findMany({
    where: eq(memorizationDayCompletions.goalId, goalId),
    orderBy: [asc(memorizationDayCompletions.date)],
  });

  return rows.map((row) => ({
    dateKey: toUtcDateKey(row.date),
    dayNumber: row.dayNumber,
  }));
}

async function syncMemorizationProgressSummary(
  tx: Tx,
  goal: { id: string; totalVerses: number; targetDays: number },
) {
  const dailyTargets = buildDailyTargets(goal.totalVerses, goal.targetDays);
  const completionRows = await getGoalCompletionDateKeys(tx, goal.id);
  const completedDays = Math.min(dailyTargets.length, completionRows.length);
  const completedVerses = completionRows.reduce((total, row) => {
    const target = dailyTargets[row.dayNumber - 1];
    return total + (target?.versesCount ?? 0);
  }, 0);
  const streakSummary = buildStreakSummary(completionRows.map((row) => row.dateKey));

  await tx
    .insert(memorizationProgress)
    .values({
      goalId: goal.id,
      completedDays,
      completedVerses: Math.min(goal.totalVerses, completedVerses),
      currentStreak: streakSummary.currentStreak,
      bestStreak: streakSummary.bestStreak,
      lastCompletedAt: streakSummary.lastCompletedAt,
    })
    .onConflictDoUpdate({
      target: memorizationProgress.goalId,
      set: {
        completedDays,
        completedVerses: Math.min(goal.totalVerses, completedVerses),
        currentStreak: streakSummary.currentStreak,
        bestStreak: streakSummary.bestStreak,
        lastCompletedAt: streakSummary.lastCompletedAt,
      },
    });

  const isGoalCompleted = completedDays >= dailyTargets.length;

  await tx
    .update(memorizationGoals)
    .set({ status: isGoalCompleted ? "completed" : "active" })
    .where(eq(memorizationGoals.id, goal.id));

  return {
    completedDays,
    completedVerses: Math.min(goal.totalVerses, completedVerses),
    currentStreak: streakSummary.currentStreak,
    bestStreak: streakSummary.bestStreak,
    isGoalCompleted,
  };
}

export async function getMemorizeMeData(userId: string): Promise<MemorizeMeData> {
  const [quranListResult, activeGoalRow] = await Promise.all([
    getQuranReadListData().catch(() => null),
    db.query.memorizationGoals.findFirst({
      where: and(eq(memorizationGoals.userId, userId), eq(memorizationGoals.status, "active")),
      orderBy: [desc(memorizationGoals.id)],
    }),
  ]);

  const surahs = quranListResult
    ? quranListResult.surahs.map((surah) => ({
      n: surah.n,
      en: surah.en,
      ar: surah.ar,
      verses: surah.verses,
    }))
    : [];

  if (!activeGoalRow) {
    return {
      surahs,
      activeGoal: null,
    };
  }

  const progressRow = await db.query.memorizationProgress.findFirst({
    where: eq(memorizationProgress.goalId, activeGoalRow.id),
  });

  const fallbackSurahMeta = {
    n: activeGoalRow.surahNumber,
    en: `Surah ${activeGoalRow.surahNumber}`,
    ar: "",
    verses: Math.max(1, activeGoalRow.totalVerses),
  };

  const surahMeta = surahs.find((item) => item.n === activeGoalRow.surahNumber) ?? fallbackSurahMeta;
  const hasSurahOption = surahs.some((item) => item.n === activeGoalRow.surahNumber);

  if (!hasSurahOption) {
    surahs.push(surahMeta);
  }

  const surahData = await getQuranReadContentData(`surah-${activeGoalRow.surahNumber}`).catch(() => null);

  const totalVersesFromGoal = Math.max(1, activeGoalRow.totalVerses || surahMeta.verses);

  const dailyTargets = buildDailyTargets(totalVersesFromGoal, activeGoalRow.targetDays);
  const completedDaysCount = Math.max(
    0,
    Math.min(progressRow?.completedDays ?? 0, dailyTargets.length),
  );
  const plannedRows = buildPlannedRows(dailyTargets, completedDaysCount);
  const totalVerses = totalVersesFromGoal;
  const completedVerses = Math.max(
    0,
    Math.min(progressRow?.completedVerses ?? 0, totalVerses),
  );

  const todayIndex = plannedRows.findIndex((row) => !row.isCompleted);
  const hasPendingDay = todayIndex >= 0;
  const todayRow = hasPendingDay ? plannedRows[todayIndex] : null;
  const plannedDays = dailyTargets.length;
  const passedDays = todayRow
    ? Math.max(1, Math.min(activeGoalRow.targetDays, todayRow.dayNumber))
    : Math.max(1, Math.min(activeGoalRow.targetDays, plannedDays));
  const remainingDays = Math.max(0, activeGoalRow.targetDays - passedDays);
  const progressPct = Math.min(100, Math.round((completedVerses / totalVerses) * 100));

  let todayTarget: MemorizeActiveGoal["todayTarget"] = null;

  if (todayRow && surahData) {
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
      currentStreak: progressRow?.currentStreak ?? 0,
      bestStreak: progressRow?.bestStreak ?? 0,
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
        totalVerses: surah.verses,
        targetDays,
        repsPerVerse,
        status: "active",
      })
      .returning({ id: memorizationGoals.id });

    if (!createdGoal) {
      throw new Error("Unable to create goal.");
    }

    await tx.insert(memorizationProgress).values({
      goalId: createdGoal.id,
      completedDays: 0,
      completedVerses: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedAt: null,
    });

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

  if (goal.status === "completed") {
    return {
      completed: true,
      isGoalCompleted: true,
    };
  }

  const progress = await db.query.memorizationProgress.findFirst({
    where: eq(memorizationProgress.goalId, goal.id),
  });

  const dailyTargets = buildDailyTargets(goal.totalVerses, goal.targetDays);
  const completedDaysCount = Math.max(
    0,
    Math.min(progress?.completedDays ?? 0, dailyTargets.length),
  );
  const isGoalCompleted = completedDaysCount >= dailyTargets.length;
  const expectedDayNumber = completedDaysCount + 1;

  if (dayNumber < expectedDayNumber) {
    return {
      completed: true,
      isGoalCompleted,
    };
  }

  if (isGoalCompleted) {
    return {
      completed: true,
      isGoalCompleted: true,
    };
  }

  if (dayNumber !== expectedDayNumber) {
    throw new Error("Invalid day target. Please complete your current day first.");
  }

  if (!dailyTargets[completedDaysCount]) {
    throw new Error("Day target not found.");
  }

  const completion = await db.transaction(async (tx) => {
    const today = startOfUtcDay(new Date());
    const tomorrow = addUtcDays(today, 1);
    const existingTodayCompletion = await tx.query.memorizationDayCompletions.findFirst({
      where: and(
        eq(memorizationDayCompletions.goalId, payload.goalId),
        gte(memorizationDayCompletions.date, today),
        lt(memorizationDayCompletions.date, tomorrow),
      ),
    });

    if (existingTodayCompletion) {
      return {
        completed: true,
        isGoalCompleted: completedDaysCount >= dailyTargets.length,
      };
    }

    const [createdCompletion] = await tx
      .insert(memorizationDayCompletions)
      .values({
        goalId: payload.goalId,
        dayNumber,
        date: today,
      })
      .onConflictDoNothing({ target: [memorizationDayCompletions.goalId, memorizationDayCompletions.date] })
      .returning({ id: memorizationDayCompletions.id });

    if (!createdCompletion) {
      const summary = await syncMemorizationProgressSummary(tx, goal);

      return {
        completed: true,
        isGoalCompleted: summary.isGoalCompleted,
      };
    }

    const summary = await syncMemorizationProgressSummary(tx, goal);

    return {
      completed: true,
      isGoalCompleted: summary.isGoalCompleted,
    };
  });

  return {
    completed: completion.completed,
    isGoalCompleted: completion.isGoalCompleted,
  };
}

export async function deleteMemorizeGoal(userId: string, payload: DeleteMemorizeGoalPayload) {
  if (!payload.goalId) {
    throw new Error("Goal id is required.");
  }

  const goal = await db.query.memorizationGoals.findFirst({
    where: and(eq(memorizationGoals.id, payload.goalId), eq(memorizationGoals.userId, userId)),
  });

  if (!goal) {
    throw new Error("Goal not found.");
  }

  await db.delete(memorizationGoals).where(eq(memorizationGoals.id, payload.goalId));

  return {
    deleted: true,
  };
}
