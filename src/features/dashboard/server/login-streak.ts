import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userActivity } from "@/db/schema";
import { addUtcDays, startOfUtcDay, toUtcDateKey } from "@/lib/streaks";

type UserActivityStreak = {
  currentStreak: number;
  bestStreak: number;
  lastCompletedAt: Date | null;
};

function normalizeCurrentStreak(lastActivityDate: Date | null, currentStreak: number, now = new Date()) {
  if (!lastActivityDate) {
    return 0;
  }

  return toUtcDateKey(lastActivityDate) === toUtcDateKey(now) ? currentStreak : 0;
}

export async function touchUserActivityLogin(userId: string) {
  const now = new Date();
  const today = startOfUtcDay(now);
  const yesterday = addUtcDays(today, -1);
  const existing = await db.query.userActivity.findFirst({
    where: eq(userActivity.userId, userId),
  });

  if (!existing) {
    await db.insert(userActivity).values({
      userId,
      lastActivityDate: today,
      lastLoginTime: now,
      currentStreak: 1,
      bestStreak: 1,
    });

    return true;
  }

  const lastActivityDate = existing.lastActivityDate ? startOfUtcDay(existing.lastActivityDate) : null;
  const isSameActivityDay = lastActivityDate ? toUtcDateKey(lastActivityDate) === toUtcDateKey(today) : false;

  if (isSameActivityDay) {
    await db
      .update(userActivity)
      .set({
        lastLoginTime: now,
        updatedAt: now,
      })
      .where(eq(userActivity.userId, userId));

    return false;
  }

  const continuesStreak = lastActivityDate ? toUtcDateKey(lastActivityDate) === toUtcDateKey(yesterday) : false;
  const nextCurrentStreak = continuesStreak ? existing.currentStreak + 1 : 1;

  await db
    .update(userActivity)
    .set({
      lastActivityDate: today,
      lastLoginTime: now,
      currentStreak: nextCurrentStreak,
      bestStreak: Math.max(existing.bestStreak, nextCurrentStreak),
      updatedAt: now,
    })
    .where(eq(userActivity.userId, userId));

  return true;
}

export async function touchUserActivityLogout(userId: string) {
  const now = new Date();
  const existing = await db.query.userActivity.findFirst({
    where: eq(userActivity.userId, userId),
  });

  if (!existing) {
    await db.insert(userActivity).values({
      userId,
      lastLogoutTime: now,
    });
    return;
  }

  await db
    .update(userActivity)
    .set({
      lastLogoutTime: now,
      updatedAt: now,
    })
    .where(eq(userActivity.userId, userId));
}

export async function getUserActivityStreak(userId: string): Promise<UserActivityStreak> {
  const activity = await db.query.userActivity.findFirst({
    where: eq(userActivity.userId, userId),
  });

  if (!activity) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedAt: null,
    };
  }

  return {
    currentStreak: normalizeCurrentStreak(activity.lastActivityDate, activity.currentStreak),
    bestStreak: activity.bestStreak,
    lastCompletedAt: activity.lastActivityDate,
  };
}
