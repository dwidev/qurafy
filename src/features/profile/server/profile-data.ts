import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { getProfileStats } from "@/features/profile/server/profile-stats";
import type { DailyGoalValue, ProfileMeData } from "@/features/profile/types";
import type { getServerSession } from "@/features/auth/server/session";

type ServerSession = NonNullable<Awaited<ReturnType<typeof getServerSession>>>;

export async function getProfileMeDataForSession(session: ServerSession): Promise<ProfileMeData> {
  const [profile, stats] = await Promise.all([
    db.query.userProfile.findFirst({
      where: eq(userProfile.userId, session.user.id),
    }),
    getProfileStats(session.user.id),
  ]);

  return {
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
}
