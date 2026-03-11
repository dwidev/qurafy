"use client";

import type { KhatamActivePlan } from "@/features/tracker/types";

export type KhatamPlan = KhatamActivePlan;

export function toDateStr(date: Date) {
  return date.toISOString().split("T")[0];
}

export function today() {
  return toDateStr(new Date());
}

export function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export function addDays(dateStr: string, count: number) {
  const next = new Date(dateStr);
  next.setDate(next.getDate() + count);
  return toDateStr(next);
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatBoundaryLabel(surahName: string, surahNumber: number, verse: number) {
  return `${surahName} ${surahNumber}:${verse}`;
}

export function computeSchedule(plan: KhatamPlan) {
  return {
    days: plan.dailyTargets,
    totalDays: plan.totalDays,
  };
}

export function computeStats(plan: KhatamPlan) {
  const { days, totalDays } = computeSchedule(plan);
  const todayStr = today();
  const currentDayIdx = days.findIndex((day) => day.date === todayStr);
  const currentDay = currentDayIdx >= 0 ? currentDayIdx + 1 : totalDays;
  const completedCount = plan.completedDays.length;
  const pct = Math.round((completedCount / totalDays) * 100);
  const todayEntry = days.find((day) => day.date === todayStr);
  const nextUpcomingEntry = days.find((day) => day.date > todayStr && !day.isCompleted);
  const primaryReadEntry =
    todayEntry && !todayEntry.isCompleted ? todayEntry : nextUpcomingEntry ?? todayEntry ?? days.at(-1);

  return {
    currentDay,
    totalDays,
    completedCount,
    pct,
    todayEntry,
    primaryReadEntry,
    daysLeft: daysBetween(todayStr, plan.targetDate),
    streak: plan.currentStreak,
  };
}
