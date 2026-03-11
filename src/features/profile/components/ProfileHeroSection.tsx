"use client";

import Link from "next/link";
import { Calendar, Mail, MapPin, Shield } from "lucide-react";
import type { ProfileUserView } from "@/features/profile/components/profile-page-types";

export function ProfileHeroSection({ user }: { user: ProfileUserView }) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-6 shadow-sm md:p-10">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-4xl border-4 border-background bg-gradient-to-br from-primary/20 to-primary/5 shadow-xl md:h-40 md:w-40">
            <span className="text-5xl font-black text-primary/40 md:text-6xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-background bg-primary text-white shadow-lg">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center space-y-4 text-center md:items-start md:text-left">
          <div className="space-y-1">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">{user.name}</h1>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {user.rank}
              </span>
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
        </div>
      </div>
    </div>
  );
}
