import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getSettingsPageDataForSession } from "@/features/settings/server/settings-data";
import {
  defaultAppearanceSettings,
  defaultNotificationSettings,
  defaultReadingSettings,
} from "@/features/settings/constants";
import type { SettingsPageData } from "@/features/settings/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function getFallbackSettingsPayload(
  session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>,
): SettingsPageData {
  return {
    appVersion: "0.1.0",
    account: {
      fullName: session.user.name,
      email: session.user.email,
      username: "",
      location: "",
      bio: "",
      dailyGoal: "build-consistency",
      emailVerified: session.user.emailVerified,
      memberSince: new Date(session.user.createdAt).toISOString(),
    },
    notifications: defaultNotificationSettings,
    appearance: defaultAppearanceSettings,
    reading: defaultReadingSettings,
    security: {
      sessions: [],
    },
    subscription: {
      id: null,
      transactionId: null,
      planType: "free",
      status: "inactive",
      billingCycle: null,
      amount: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
    billing: {
      donations: [],
      totalConfirmedAmount: 0,
      totalConfirmedCount: 0,
      activeSupporter: false,
    },
  };
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const data = await getSettingsPageDataForSession(session);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/settings/me] Failed to load settings", error);
    return NextResponse.json(getFallbackSettingsPayload(session));
  }
}
