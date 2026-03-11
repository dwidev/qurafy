import { CompleteProfileForm } from "@/features/profile/components/CompleteProfileForm";
import { requireServerSession } from "@/features/auth/server/session";
import { getServerUserProfile } from "@/features/profile/server/profile-context";
import type { DailyGoalValue, ProfileMeData } from "@/features/profile/types";

export default async function CompleteProfilePage() {
  const session = await requireServerSession();
  const profile = await getServerUserProfile();

  const initialData: ProfileMeData = {
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
    stats: {
      completedKhatam: 0,
      activeGoals: 0,
      completedVerses: 0,
      totalVersesRead: 0,
      currentStreak: 0,
      bestStreak: 0,
      rank: "New Explorer",
    },
  };

  return <CompleteProfileForm initialData={initialData} />;
}
