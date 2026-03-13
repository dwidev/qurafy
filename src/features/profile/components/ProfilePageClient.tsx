"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfileErrorMessage, isUnauthorizedProfileError, useProfileMeQuery } from "@/features/profile/api/client";
import { useSettingsPageQuery } from "@/features/settings/api/client";
import {
  ProfileAchievementsSection,
  ProfileHeroSection,
  ProfilePageErrorState,
  ProfilePageSkeletonView,
  ProfileQuickActions,
  ProfileStatsGrid,
  profileStatIcons,
} from "@/features/profile/components/ProfilePageSections";

export function ProfilePageClient() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isRefetching } = useProfileMeQuery();
  const { data: settingsData } = useSettingsPageQuery();

  useEffect(() => {
    if (data && !data.profile) {
      router.replace("/complete-profile");
    }
  }, [data, router]);

  useEffect(() => {
    if (error && isUnauthorizedProfileError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isError) {
    return <ProfilePageErrorState message={getProfileErrorMessage(error)} onRetry={() => refetch()} />;
  }

  if (isLoading || !data || !data.profile) {
    return <ProfilePageSkeletonView />;
  }

  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(data.user.createdAt));

  const user = {
    name: data.user.name,
    username: `@${data.profile.username}`,
    email: data.user.email,
    location: data.profile.location,
    bio: data.profile.bio,
    joinedDate,
    rank: data.stats.rank,
  };
  const subscription = settingsData?.subscription;
  const isPro = subscription?.planType === "pro" && subscription.status === "active";

  const stats = [
    {
      label: "Best Day Streak",
      value: data.stats.bestStreak,
      icon: profileStatIcons.Flame,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Verses Done",
      value: data.stats.totalVersesRead,
      icon: profileStatIcons.BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Khatam Done",
      value: data.stats.completedKhatam,
      icon: profileStatIcons.Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Active Goals",
      value: data.stats.activeGoals,
      icon: profileStatIcons.Target,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Early Momentum",
      icon: profileStatIcons.Flame,
      color: "text-orange-500",
      bg: "bg-orange-50",
      desc:
        data.stats.bestStreak >= 7
          ? `Best streak: ${data.stats.bestStreak} days`
          : "Build your streak to 7 days",
    },
    {
      id: 2,
      title: "Century Club",
      icon: profileStatIcons.Trophy,
      color: "text-blue-500",
      bg: "bg-blue-50",
      desc:
        data.stats.totalVersesRead >= 100
          ? `${data.stats.totalVersesRead} verses completed`
          : `Complete ${100 - data.stats.totalVersesRead} more verses to unlock`,
    },
    {
      id: 3,
      title: "Khatam Milestone",
      icon: profileStatIcons.Calendar,
      color: "text-amber-500",
      bg: "bg-amber-50",
      desc:
        data.stats.completedKhatam > 0
          ? `Completed ${data.stats.completedKhatam} khatam plan${data.stats.completedKhatam > 1 ? "s" : ""}`
          : "Complete your first khatam plan",
    },
  ];

  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-24 pt-6 md:p-8">
      <ProfileHeroSection
        user={user}
        isRefreshing={isRefetching}
        isPro={isPro}
        billingCycle={subscription?.billingCycle ?? null}
      />
      <ProfileStatsGrid stats={stats} />

      <div className="grid gap-8 pt-4 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <ProfileAchievementsSection achievements={achievements} />
        </div>
        <div className="space-y-6">
          <ProfileQuickActions />
        </div>
      </div>
    </div>
  );
}
