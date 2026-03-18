import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { habitEntries, habits } from "@/db/schema";
import { addUtcDays, buildStreakSummary, fromUtcDateKey, startOfUtcDay, toUtcDateKey } from "@/lib/streaks";
import type {
  HabitColor,
  HabitMeData,
  HabitRecord,
  HabitRoutine,
  HabitSuggestion,
  HabitType,
  SaveHabitPayload,
  UpdateHabitPayload,
  UpsertHabitEntryPayload,
} from "@/features/habits/types";
import { HABIT_COLORS, HABIT_ROUTINES, HABIT_TYPES } from "@/features/habits/types";

const WEEK_DAYS = 7;
const DEFAULT_COLOR: HabitColor = "emerald";
const DEFAULT_ROUTINE: HabitRoutine = "anytime";
const DEFAULT_TYPE: HabitType = "boolean";
const HABITS_UNAVAILABLE_MESSAGE = "Habits is temporarily unavailable in this environment.";
const DEFAULT_PRAYER_HABITS: SaveHabitPayload[] = [
  {
    title: "Subuh",
    category: "Prayer",
    routine: "morning",
    type: "boolean",
    target: 1,
    unit: null,
    color: "emerald",
  },
  {
    title: "Dzuhur",
    category: "Prayer",
    routine: "afternoon",
    type: "boolean",
    target: 1,
    unit: null,
    color: "amber",
  },
  {
    title: "Ashar",
    category: "Prayer",
    routine: "afternoon",
    type: "boolean",
    target: 1,
    unit: null,
    color: "rose",
  },
  {
    title: "Maghrib",
    category: "Prayer",
    routine: "evening",
    type: "boolean",
    target: 1,
    unit: null,
    color: "indigo",
  },
  {
    title: "Isya",
    category: "Prayer",
    routine: "evening",
    type: "boolean",
    target: 1,
    unit: null,
    color: "blue",
  },
];

const SUGGESTED_HABITS: HabitSuggestion[] = [
  {
    label: "Read 2 Quran pages",
    category: "Quran",
    routine: "morning",
    type: "quantitative",
    target: 2,
    unit: "pages",
    color: "amber",
  },
  {
    label: "Morning adhkar",
    category: "Mindfulness",
    routine: "morning",
    type: "boolean",
    target: 1,
    unit: null,
    color: "rose",
  },
  {
    label: "Drink 8 glasses of water",
    category: "Health",
    routine: "anytime",
    type: "quantitative",
    target: 8,
    unit: "glasses",
    color: "blue",
  },
  {
    label: "Review one memorization page",
    category: "Learning",
    routine: "evening",
    type: "quantitative",
    target: 1,
    unit: "page",
    color: "indigo",
  },
];

type HabitRow = typeof habits.$inferSelect;

function getHabitErrorChain(error: unknown) {
  const chain: Array<{ code: string; message: string }> = [];
  let current = error;

  while (current && typeof current === "object") {
    const code = "code" in current ? String(current.code) : "";
    const message = "message" in current ? String(current.message) : "";

    chain.push({ code, message });

    if (!("cause" in current) || current.cause === current) {
      break;
    }

    current = current.cause;
  }

  return chain;
}

function isMissingHabitStructure(error: unknown) {
  return getHabitErrorChain(error).some(({ code, message }) => {
    if (!["42P01", "42703", "42704"].includes(code)) {
      return false;
    }

    return ["habits", "habit_entries", "habit_type", "habit_routine"].some((identifier) =>
      message.includes(identifier),
    );
  });
}

function rethrowHabitStructureError(error: unknown): never {
  if (isMissingHabitStructure(error)) {
    throw new Error(HABITS_UNAVAILABLE_MESSAGE);
  }

  throw error;
}

function roundPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseDateKey(value: string, fieldName: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${fieldName} must use YYYY-MM-DD format.`);
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${fieldName}.`);
  }

  return startOfUtcDay(parsed);
}

function normalizeTitle(title: string) {
  const normalized = title.trim();

  if (normalized.length < 3 || normalized.length > 80) {
    throw new Error("Habit title must be between 3 and 80 characters.");
  }

  return normalized;
}

function normalizeCategory(category: string) {
  const normalized = category.trim();

  if (normalized.length < 2 || normalized.length > 40) {
    throw new Error("Category must be between 2 and 40 characters.");
  }

  return normalized;
}

function normalizeColor(color: string | undefined): HabitColor {
  if (color && HABIT_COLORS.includes(color as HabitColor)) {
    return color as HabitColor;
  }

  return DEFAULT_COLOR;
}

function normalizeRoutine(routine: string | undefined): HabitRoutine {
  if (routine && HABIT_ROUTINES.includes(routine as HabitRoutine)) {
    return routine as HabitRoutine;
  }

  return DEFAULT_ROUTINE;
}

function normalizeType(type: string | undefined): HabitType {
  if (type && HABIT_TYPES.includes(type as HabitType)) {
    return type as HabitType;
  }

  return DEFAULT_TYPE;
}

function normalizeTarget(type: HabitType, target: number | undefined) {
  if (type === "boolean") {
    return 1;
  }

  if (!Number.isFinite(target) || !Number.isInteger(target) || (target ?? 0) < 1 || (target ?? 0) > 9999) {
    throw new Error("Quantitative habit target must be an integer between 1 and 9999.");
  }

  return target;
}

function normalizeUnit(type: HabitType, unit: string | null | undefined) {
  if (type === "boolean") {
    return null;
  }

  const normalized = unit?.trim() ?? "";

  if (normalized.length < 1 || normalized.length > 20) {
    throw new Error("Quantitative habit unit must be between 1 and 20 characters.");
  }

  return normalized;
}

function normalizeIconName(iconName: string | null | undefined) {
  const normalized = iconName?.trim() ?? "";
  return normalized.length > 0 ? normalized.slice(0, 40) : null;
}

function normalizeSaveHabitPayload(payload: SaveHabitPayload) {
  const type = normalizeType(payload.type);

  return {
    title: normalizeTitle(payload.title),
    category: normalizeCategory(payload.category),
    color: normalizeColor(payload.color),
    routine: normalizeRoutine(payload.routine),
    type,
    target: normalizeTarget(type, payload.target),
    unit: normalizeUnit(type, payload.unit),
    iconName: normalizeIconName(payload.iconName),
  };
}

function normalizeEntryValue(habit: HabitRow, value: number) {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > 9999) {
    throw new Error("Habit progress value must be an integer between 0 and 9999.");
  }

  if (habit.type === "boolean") {
    return value > 0 ? 1 : 0;
  }

  return value;
}

async function findOwnedHabit(userId: string, habitId: string) {
  const row = await db.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, userId), isNull(habits.archivedAt)),
  });

  if (!row) {
    throw new Error("Habit not found.");
  }

  return row;
}

function buildWeekPoints(habit: HabitRow, entryMap: Map<string, number>, today: Date) {
  const weekStart = addUtcDays(today, -(WEEK_DAYS - 1));

  return Array.from({ length: WEEK_DAYS }, (_, index) => {
    const date = addUtcDays(weekStart, index);
    const dateKey = toUtcDateKey(date);
    const value = entryMap.get(dateKey) ?? 0;
    const target = habit.type === "boolean" ? 1 : habit.target;

    return {
      date: dateKey,
      value,
      target,
      isCompleted: value >= target,
      isToday: dateKey === toUtcDateKey(today),
    };
  });
}

function buildPerfectDayKeys(habitRows: HabitRow[], completedByHabit: Map<string, Set<string>>, today: Date) {
  if (habitRows.length === 0) {
    return [];
  }

  const earliestCreatedAt = habitRows.reduce((earliest, row) => {
    return row.createdAt < earliest ? row.createdAt : earliest;
  }, habitRows[0].createdAt);

  const startDate = startOfUtcDay(earliestCreatedAt);
  const perfectDayKeys: string[] = [];

  for (let cursor = startDate; cursor.getTime() <= today.getTime(); cursor = addUtcDays(cursor, 1)) {
    const dateKey = toUtcDateKey(cursor);
    const activeHabits = habitRows.filter((row) => startOfUtcDay(row.createdAt).getTime() <= cursor.getTime());

    if (activeHabits.length === 0) {
      continue;
    }

    const isPerfectDay = activeHabits.every((row) => completedByHabit.get(row.id)?.has(dateKey));

    if (isPerfectDay) {
      perfectDayKeys.push(dateKey);
    }
  }

  return perfectDayKeys;
}

function buildEmptyPayload(isAvailable = true): HabitMeData {
  return {
    isAvailable,
    summary: {
      totalHabits: 0,
      completedToday: 0,
      completionRateToday: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalCheckIns: 0,
      consistencyScore: 0,
    },
    habits: [],
    categories: [],
    suggestions: SUGGESTED_HABITS,
  };
}

async function seedDefaultPrayerHabits(userId: string) {
  const values = DEFAULT_PRAYER_HABITS.map((payload) => {
    const normalized = normalizeSaveHabitPayload(payload);

    return {
      userId,
      title: normalized.title,
      category: normalized.category,
      color: normalized.color,
      iconName: normalized.iconName,
      type: normalized.type,
      routine: normalized.routine,
      target: normalized.target,
      unit: normalized.unit,
    };
  });

  await db.insert(habits).values(values);
}

export async function getHabitsMeData(userId: string): Promise<HabitMeData> {
  try {
    let habitRows = await db.query.habits.findMany({
      where: and(eq(habits.userId, userId), isNull(habits.archivedAt)),
      orderBy: [asc(habits.routine), desc(habits.createdAt)],
    });

    if (habitRows.length === 0) {
      await seedDefaultPrayerHabits(userId);
      habitRows = await db.query.habits.findMany({
        where: and(eq(habits.userId, userId), isNull(habits.archivedAt)),
        orderBy: [asc(habits.routine), desc(habits.createdAt)],
      });
    }

    if (habitRows.length === 0) {
      return buildEmptyPayload();
    }

    const joinedEntries = await db
      .select({
        habitId: habitEntries.habitId,
        date: habitEntries.date,
        value: habitEntries.value,
      })
      .from(habitEntries)
      .innerJoin(habits, eq(habitEntries.habitId, habits.id))
      .where(and(eq(habits.userId, userId), isNull(habits.archivedAt)))
      .orderBy(asc(habitEntries.date));

    const today = startOfUtcDay(new Date());
    const todayKey = toUtcDateKey(today);
    const entriesByHabit = new Map<string, Map<string, number>>();

    for (const row of joinedEntries) {
      const dateKey = toUtcDateKey(row.date);
      const existing = entriesByHabit.get(row.habitId) ?? new Map<string, number>();
      existing.set(dateKey, row.value);
      entriesByHabit.set(row.habitId, existing);
    }

    const completedByHabit = new Map<string, Set<string>>();

    const habitsPayload: HabitRecord[] = habitRows.map((habitRow) => {
      const entryMap = entriesByHabit.get(habitRow.id) ?? new Map<string, number>();
      const completedKeys = Array.from(entryMap.entries())
        .filter(([, value]) => value >= habitRow.target)
        .map(([dateKey]) => dateKey);
      const completedSet = new Set(completedKeys);

      completedByHabit.set(habitRow.id, completedSet);

      const todayValue = entryMap.get(todayKey) ?? 0;
      const week = buildWeekPoints(habitRow, entryMap, today);
      const streak = buildStreakSummary(completedKeys, today);
      const completedDaysThisWeek = week.filter((point) => point.isCompleted).length;

      return {
        id: habitRow.id,
        title: habitRow.title,
        category: habitRow.category,
        color: normalizeColor(habitRow.color),
        iconName: habitRow.iconName,
        type: habitRow.type,
        routine: habitRow.routine,
        target: habitRow.target,
        unit: habitRow.unit,
        createdAt: habitRow.createdAt.toISOString(),
        updatedAt: habitRow.updatedAt.toISOString(),
        todayValue,
        isCompletedToday: todayValue >= habitRow.target,
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        totalCheckIns: completedKeys.length,
        completionRate7d: roundPercentage((completedDaysThisWeek / WEEK_DAYS) * 100),
        week,
      };
    });

    const completedToday = habitsPayload.filter((habit) => habit.isCompletedToday).length;
    const perfectDayKeys = buildPerfectDayKeys(habitRows, completedByHabit, today);
    const perfectDayAnchor = completedToday === habitsPayload.length ? today : addUtcDays(today, -1);
    const perfectDayStreak = buildStreakSummary(perfectDayKeys, perfectDayAnchor);
    const totalCheckIns = habitsPayload.reduce((total, habit) => total + habit.totalCheckIns, 0);
    const consistencyScore = roundPercentage(
      habitsPayload.reduce((total, habit) => total + habit.completionRate7d, 0) / Math.max(1, habitsPayload.length),
    );
    const existingTitles = new Set(habitsPayload.map((habit) => habit.title.toLowerCase()));
    const suggestions = SUGGESTED_HABITS.filter((item) => !existingTitles.has(item.label.toLowerCase()));

    return {
      isAvailable: true,
      summary: {
        totalHabits: habitsPayload.length,
        completedToday,
        completionRateToday: roundPercentage((completedToday / habitsPayload.length) * 100),
        currentStreak: perfectDayStreak.currentStreak,
        bestStreak: perfectDayStreak.bestStreak,
        totalCheckIns,
        consistencyScore,
      },
      habits: habitsPayload,
      categories: Array.from(new Set(habitsPayload.map((habit) => habit.category))).sort((left, right) =>
        left.localeCompare(right),
      ),
      suggestions,
    };
  } catch (error) {
    if (isMissingHabitStructure(error)) {
      return buildEmptyPayload(false);
    }

    throw error;
  }
}

export async function createHabit(userId: string, payload: SaveHabitPayload) {
  try {
    const normalized = normalizeSaveHabitPayload(payload);
    const [created] = await db
      .insert(habits)
      .values({
        userId,
        title: normalized.title,
        category: normalized.category,
        color: normalized.color,
        iconName: normalized.iconName,
        type: normalized.type,
        routine: normalized.routine,
        target: normalized.target,
        unit: normalized.unit,
      })
      .returning({
        id: habits.id,
      });

    return {
      habitId: created.id,
    };
  } catch (error) {
    rethrowHabitStructureError(error);
  }
}

export async function updateHabit(userId: string, payload: UpdateHabitPayload) {
  try {
    await findOwnedHabit(userId, payload.habitId);
    const normalized = normalizeSaveHabitPayload(payload);

    await db
      .update(habits)
      .set({
        title: normalized.title,
        category: normalized.category,
        color: normalized.color,
        iconName: normalized.iconName,
        type: normalized.type,
        routine: normalized.routine,
        target: normalized.target,
        unit: normalized.unit,
        updatedAt: new Date(),
      })
      .where(and(eq(habits.id, payload.habitId), eq(habits.userId, userId), isNull(habits.archivedAt)));

    return {
      updated: true,
    };
  } catch (error) {
    rethrowHabitStructureError(error);
  }
}

export async function deleteHabit(userId: string, habitId: string) {
  try {
    await findOwnedHabit(userId, habitId);

    await db
      .update(habits)
      .set({
        archivedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(habits.id, habitId), eq(habits.userId, userId), isNull(habits.archivedAt)));

    return {
      deleted: true,
    };
  } catch (error) {
    rethrowHabitStructureError(error);
  }
}

export async function upsertHabitEntry(userId: string, payload: UpsertHabitEntryPayload) {
  try {
    const habit = await findOwnedHabit(userId, payload.habitId);
    const entryDate = payload.date ? parseDateKey(payload.date, "date") : startOfUtcDay(new Date());
    const normalizedValue = normalizeEntryValue(habit, payload.value);

    if (normalizedValue === 0) {
      await db
        .delete(habitEntries)
        .where(and(eq(habitEntries.habitId, habit.id), eq(habitEntries.date, entryDate)));
    } else {
      await db
        .insert(habitEntries)
        .values({
          habitId: habit.id,
          date: entryDate,
          value: normalizedValue,
        })
        .onConflictDoUpdate({
          target: [habitEntries.habitId, habitEntries.date],
          set: {
            value: normalizedValue,
            updatedAt: new Date(),
          },
        });
    }

    const completed = normalizedValue >= habit.target;

    return {
      saved: true,
      completed,
      value: normalizedValue,
      date: toUtcDateKey(entryDate),
    };
  } catch (error) {
    rethrowHabitStructureError(error);
  }
}

export async function seedSuggestedHabit(userId: string, title: string) {
  const match = SUGGESTED_HABITS.find((item) => item.label === title);

  if (!match) {
    throw new Error("Suggested habit not found.");
  }

  return createHabit(userId, {
    title: match.label,
    category: match.category,
    color: match.color,
    type: match.type,
    routine: match.routine,
    target: match.target,
    unit: match.unit,
    iconName: null,
  });
}

export function getHabitDayLabel(dateKey: string) {
  return fromUtcDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "short",
  });
}
