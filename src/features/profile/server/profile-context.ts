import { eq } from "drizzle-orm";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { requireServerSession } from "@/features/auth/server/session";

export const getServerUserProfile = cache(async () => {
  const session = await requireServerSession();

  return db.query.userProfile.findFirst({
    where: eq(userProfile.userId, session.user.id),
  });
});

export const requireServerUserProfile = cache(async () => {
  const profile = await getServerUserProfile();

  if (!profile) {
    redirect("/complete-profile");
  }

  return profile;
});
