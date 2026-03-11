import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { khatamPlans, khatamProgress, memorizationGoals, memorizationProgress } from "@/db/schema";
import { getUserActivityStreak } from "@/features/dashboard/server/login-streak";
import { ProfileStats } from "../types";

export function getRankLabel(completedKhatam: number, completedVerses: number) {
  if (completedKhatam >= 3 || completedVerses >= 500) return "Qurafy Mentor";
  if (completedKhatam >= 1 || completedVerses >= 200) return "Hafiz Apprentice";
  if (completedVerses >= 50) return "Steady Learner";
  return "New Explorer";
}

export async function getProfileStats(userId: string) : Promise<ProfileStats> {
  const [khatamCountRow, activeGoalsRow, completedVersesRow, completedKhatamVerses, loginStreak] = await Promise.all([
    db
      .select({ total: sql<number>`count(*)` })
      .from(khatamPlans)
      .where(and(eq(khatamPlans.userId, userId), eq(khatamPlans.isCompleted, true), isNull(khatamPlans.deletedAt))),
    db
      .select({ total: sql<number>`count(*)` })
      .from(memorizationGoals)
      .where(and(eq(memorizationGoals.userId, userId), eq(memorizationGoals.status, "active"), isNull(memorizationGoals.deletedAt))),
    db
      .select({ total: sql<number>`coalesce(sum(${memorizationProgress.completedVerses}), 0)` })
      .from(memorizationProgress)
      .innerJoin(memorizationGoals, eq(memorizationProgress.goalId, memorizationGoals.id))
      .where(and(eq(memorizationGoals.userId, userId), isNull(memorizationGoals.deletedAt))),
    db
      .select({ total: sql<number>`coalesce(sum(${khatamProgress.completedVerses}), 0)` })
      .from(khatamProgress)
      .innerJoin(khatamPlans, eq(khatamProgress.planId, khatamPlans.id))
      .where(and(eq(khatamPlans.userId, userId), eq(khatamProgress.isDone, true), isNull(khatamPlans.deletedAt)))
      .then((rows) => Number(rows[0]?.total ?? 0))
      .catch(() => 0),
    getUserActivityStreak(userId).catch(() => ({
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedAt: null,
    })),
  ]);

  const completedKhatam = Number(khatamCountRow[0]?.total ?? 0);
  const activeGoals = Number(activeGoalsRow[0]?.total ?? 0);
  const completedVerses = Number(completedVersesRow[0]?.total ?? 0);
  const totalVersesRead = completedVerses + completedKhatamVerses;

  return {
    completedKhatam,
    activeGoals,
    completedVerses,
    totalVersesRead,
    currentStreak: loginStreak.currentStreak,
    bestStreak: loginStreak.bestStreak,
    rank: getRankLabel(completedKhatam, totalVersesRead),
  };
}
