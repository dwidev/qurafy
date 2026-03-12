import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, userProfile } from "@/db/schema";
import { getServerSession } from "@/features/auth/server/session";
import type { DailyGoalValue } from "@/features/profile/types";

const allowedGoals = new Set<DailyGoalValue>([
  "build-consistency",
  "memorize-juz-amma",
  "finish-khatam",
  "learn-tafsir",
]);

const usernameRegex = /^[a-z0-9_]{3,20}$/;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const body = (await request.json()) as {
    fullName?: string;
    username?: string;
    location?: string;
    bio?: string;
    dailyGoal?: DailyGoalValue;
  };

  const fullName = body.fullName?.trim() ?? "";
  const username = body.username?.trim().toLowerCase() ?? "";
  const location = body.location?.trim() ?? "";
  const bio = body.bio?.trim() ?? "";
  const dailyGoal = body.dailyGoal?.trim() as DailyGoalValue | undefined;

  if (fullName.length < 2 || fullName.length > 80) {
    return jsonError("Full name must be between 2 and 80 characters.", 400);
  }

  if (!usernameRegex.test(username)) {
    return jsonError("Username must be 3-20 characters (letters, numbers, underscore).", 400);
  }

  if (location.length < 2 || location.length > 80) {
    return jsonError("Location must be between 2 and 80 characters.", 400);
  }

  if (bio.length < 10 || bio.length > 280) {
    return jsonError("Bio must be between 10 and 280 characters.", 400);
  }

  if (!dailyGoal || !allowedGoals.has(dailyGoal)) {
    return jsonError("Invalid daily goal.", 400);
  }

  const now = new Date();

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(user)
        .set({
          name: fullName,
          updatedAt: now,
        })
        .where(eq(user.id, session.user.id));

      await tx
        .insert(userProfile)
        .values({
          userId: session.user.id,
          username,
          location,
          bio,
          dailyGoal,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: userProfile.userId,
          set: {
            username,
            location,
            bio,
            dailyGoal,
            updatedAt: now,
          },
        });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("user_profile_username_unique")) {
      return jsonError("Username is already taken.", 409);
    }

    return jsonError("Failed to save profile.", 500);
  }

  return NextResponse.json({ ok: true });
}
