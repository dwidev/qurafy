import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { khatamPlans, memorizationGoals, memorizationProgress } from "@/db/schema";
import { getUserLoginStreak } from "@/features/dashboard/server/login-streak";

export function getRankLabel(completedKhatam: number, completedVerses: number) {
  if (completedKhatam >= 3 || completedVerses >= 500) return "Qurafy Mentor";
  if (completedKhatam >= 1 || completedVerses >= 200) return "Hafiz Apprentice";
  if (completedVerses >= 50) return "Steady Learner";
  return "New Explorer";
}

export async function getProfileStats(userId: string) {
  const [khatamCountRow, activeGoalsRow, completedVersesRow, loginStreak] = await Promise.all([
    db
      .select({ total: sql<number>`count(*)` })
      .from(khatamPlans)
      .where(and(eq(khatamPlans.userId, userId), eq(khatamPlans.isCompleted, true))),
    db
      .select({ total: sql<number>`count(*)` })
      .from(memorizationGoals)
      .where(and(eq(memorizationGoals.userId, userId), eq(memorizationGoals.status, "active"))),
    db
      .select({ total: sql<number>`coalesce(sum(${memorizationProgress.completedVerses}), 0)` })
      .from(memorizationProgress)
      .innerJoin(memorizationGoals, eq(memorizationProgress.goalId, memorizationGoals.id))
      .where(eq(memorizationGoals.userId, userId)),
    getUserLoginStreak(userId).catch(() => ({
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedAt: null,
    })),
  ]);

  const completedKhatam = Number(khatamCountRow[0]?.total ?? 0);
  const activeGoals = Number(activeGoalsRow[0]?.total ?? 0);
  const completedVerses = Number(completedVersesRow[0]?.total ?? 0);

  return {
    completedKhatam,
    activeGoals,
    completedVerses,
    estimatedStreakDays: loginStreak.currentStreak,
    rank: getRankLabel(completedKhatam, completedVerses),
  };
}
