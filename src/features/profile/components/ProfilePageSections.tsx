"use client";

import Link from "next/link";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Flame,
  Heart,
  Mail,
  MapPin,
  Medal,
  Settings,
  Shield,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ProFlag } from "@/components/shared/ProFlag";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileStat = {
  label: string;
  value: number;
  icon: typeof Flame;
  color: string;
  bg: string;
};

type ProfileAchievement = {
  id: number;
  title: string;
  desc: string;
  icon: typeof Flame;
  color: string;
  bg: string;
};

type ProfileUserView = {
  name: string;
  username: string;
  email: string;
  location: string;
  bio: string;
  joinedDate: string;
  rank: string;
};

export function ProfilePageErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl flex-1 p-4 pb-24 pt-6 md:p-8">
      <div className="space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-black">Could not load profile</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export function ProfilePageSkeletonView() {
  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-24 pt-6 md:p-8">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-6 shadow-sm md:p-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <Skeleton className="h-32 w-32 rounded-4xl md:h-40 md:w-40" />
          <div className="w-full flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-9 w-52" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-16 w-full max-w-xl" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-52" />
            </div>
            <div className="flex gap-3 pt-1">
              <Skeleton className="h-11 w-36 rounded-full" />
              <Skeleton className="h-11 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-3xl border border-border bg-card p-6">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-3xl border border-border bg-card p-5">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-36" />
          <div className="space-y-2 rounded-3xl border border-border bg-card p-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-4 rounded-4xl border border-primary/20 bg-card p-8">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileHeroSection({
  user,
  isRefreshing = false,
  isPro = false,
  billingCycle = null,
}: {
  user: ProfileUserView;
  isRefreshing?: boolean;
  isPro?: boolean;
  billingCycle?: "monthly" | "yearly" | null;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-6 shadow-sm md:p-10">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />

      {isRefreshing ? (
        <div
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/95 px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm backdrop-blur"
          aria-live="polite"
          role="status"
        >
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          Refreshing profile...
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-4xl border-4 border-background bg-linear-to-br from-primary/20 to-primary/5 shadow-xl md:h-40 md:w-40">
            <span className="text-5xl font-black text-primary/40 md:text-6xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          {isPro ? (
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-background bg-primary text-white shadow-lg">
              <Shield className="h-5 w-5" />
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col items-center space-y-4 text-center md:items-start md:text-left">
          <div className="space-y-1">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {user.rank}
                </span>
                {isPro ? <ProFlag billingCycle={billingCycle} /> : null}
              </div>
            </div>
            <p className="font-medium text-muted-foreground">{user.username}</p>
          </div>

          <p className="max-w-lg leading-relaxed text-foreground/80">{user.bio}</p>

          <div className="flex flex-wrap justify-center gap-4 pt-2 text-sm text-muted-foreground md:justify-start">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {user.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Joined {user.joinedDate}
            </span>
            <span className="flex items-center gap-1.5 break-all">
              <Mail className="h-4 w-4" /> {user.email}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/complete-profile"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Edit Profile
            </Link>
            <Link
              href="/app"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-bold transition-all hover:bg-muted"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="w-full pt-2">
            <ProfileProCard isPro={isPro} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileStatsGrid({ stats }: { stats: ProfileStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="absolute -bottom-4 -right-4 opacity-5 text-foreground transition-transform group-hover:scale-110 group-hover:-rotate-12">
            <stat.icon className="h-24 w-24" />
          </div>
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <p className="text-3xl font-black leading-none">{stat.value}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export function ProfileAchievementsSection({ achievements }: { achievements: ProfileAchievement[] }) {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-3 px-1 text-2xl font-black">
        Achievements
        <span className="flex h-6 w-9 items-center justify-center rounded-lg bg-secondary text-[10px] font-black text-muted-foreground">
          {achievements.length}
        </span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="group flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/20"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color} shadow-sm transition-transform group-hover:scale-110`}
            >
              <item.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold leading-tight">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}

        <Link
          href="/app/memorize"
          className="group flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-secondary/5 p-5 text-center transition-all hover:bg-secondary/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:text-primary">
            <Medal className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Keep Progressing</p>
        </Link>
      </div>
    </div>
  );
}

export function ProfileQuickActions() {
  return (
    <div className="space-y-6">
      <h2 className="px-1 text-2xl font-black">Quick Actions</h2>
      <div className="divide-y divide-border/50 rounded-3xl border border-border bg-card p-2 shadow-sm">
        {[
          { label: "Account Settings", icon: Settings, href: "/app/settings", color: "text-foreground" },
          { label: "Notification Prefs", icon: Bell, href: "/app/settings", color: "text-foreground" },
          { label: "Privacy & Security", icon: Shield, href: "/app/settings", color: "text-foreground" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between p-4 transition-colors first:rounded-t-[1.25rem] hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/50 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className={`text-sm font-bold ${item.color}`}>{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
          </Link>
        ))}
        <LogoutButton
          showLabel
          className="w-full rounded-b-[1.25rem] p-4 text-sm font-bold text-destructive transition-colors hover:bg-muted/50"
          iconClassName="h-4 w-4"
        />
      </div>
    </div>
  );
}

export function ProfileProCard({ isPro = false }: { isPro?: boolean }) {
  if (isPro) {
    return null;
  }

  return (
    <div className="group/pro relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-gradient-to-r from-primary/10 via-background to-amber-500/5 p-4 shadow-lg shadow-primary/5">
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-transform duration-700 group-hover/pro:scale-150" />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Get Pro</p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">Monthly or Yearly</span>
            </div>
            <h3 className="text-base font-black">Unlock Qurafy Pro</h3>
            <p className="max-w-xl text-xs font-medium leading-relaxed text-muted-foreground">
              Start a monthly or yearly supporter plan for Pro access. Pure Sadaqah stays separate and does not unlock subscription benefits.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/donate"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-black text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            Subscribe
          </Link>
          <Link
            href="/sadaqah"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 text-xs font-black text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white sm:w-auto"
          >
            <Heart className="h-4 w-4" />
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
}

export const profileStatIcons = {
  Flame,
  BookOpen,
  Calendar,
  Target,
  Trophy,
};
