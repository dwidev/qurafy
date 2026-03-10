import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { userLoginDays } from "@/db/schema";
import { buildStreakSummary, startOfUtcDay, toUtcDateKey } from "@/lib/streaks";

export async function touchUserLoginDay(userId: string) {
  const today = startOfUtcDay(new Date());
  const [created] = await db
    .insert(userLoginDays)
    .values({
      userId,
      date: today,
    })
    .onConflictDoNothing({ target: [userLoginDays.userId, userLoginDays.date] })
    .returning({ id: userLoginDays.id });

  return Boolean(created);
}

export async function getUserLoginStreak(userId: string) {
  const rows = await db.query.userLoginDays.findMany({
    where: eq(userLoginDays.userId, userId),
    orderBy: [asc(userLoginDays.date)],
  });
  const dateKeys = rows.map((row) => toUtcDateKey(row.date));

  return buildStreakSummary(dateKeys);
}
