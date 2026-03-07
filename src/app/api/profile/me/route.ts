import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { getServerSession } from "@/features/auth/server/session";
import { getProfileStats } from "@/features/profile/server/profile-stats";
import type { DailyGoalValue, ProfileMeData } from "@/features/profile/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const [profile, stats] = await Promise.all([
    db.query.userProfile.findFirst({
      where: eq(userProfile.userId, session.user.id),
    }),
    getProfileStats(session.user.id),
  ]);

  const payload: ProfileMeData = {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      createdAt: new Date(session.user.createdAt).toISOString(),
    },
    profile: profile
      ? {
          username: profile.username,
          location: profile.location,
          bio: profile.bio,
          dailyGoal: profile.dailyGoal as DailyGoalValue,
          createdAt: new Date(profile.createdAt).toISOString(),
          updatedAt: new Date(profile.updatedAt).toISOString(),
        }
      : null,
    stats,
  };

  return NextResponse.json(payload);
}
