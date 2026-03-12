import { desc, eq } from "drizzle-orm";
import pkg from "../../../../package.json";
import { db } from "@/db";
import { donations, session as authSession, userProfile, userSettings } from "@/db/schema";
import { getServerSession, requireServerSession } from "@/features/auth/server/session";
import {
  defaultAppearanceSettings,
  defaultNotificationSettings,
  defaultReadingSettings,
} from "@/features/settings/constants";
import type { SettingsPageData, SettingsBillingItem } from "@/features/settings/types";

type UserSettingsRecord = Partial<typeof userSettings.$inferSelect> | undefined;

function isMissingDbStructure(error: unknown, identifiers: string[]) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";

  if (!["42703", "42P01"].includes(code)) {
    return false;
  }

  return identifiers.some((identifier) => message.includes(identifier));
}

export async function findUserSettingsWithFallback(userId: string): Promise<UserSettingsRecord> {
  try {
    return await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, userId),
    });
  } catch (error) {
    if (!isMissingDbStructure(error, ["user_settings"])) {
      throw error;
    }
    return undefined;
  }
}

async function findUserProfileWithFallback(userId: string) {
  try {
    return await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, userId),
    });
  } catch (error) {
    if (!isMissingDbStructure(error, ["user_profile"])) {
      throw error;
    }

    return undefined;
  }
}

async function findSessionsWithFallback(userId: string) {
  try {
    return await db.query.session.findMany({
      where: eq(authSession.userId, userId),
      orderBy: [desc(authSession.updatedAt)],
      limit: 5,
    });
  } catch (error) {
    if (!isMissingDbStructure(error, ["session"])) {
      throw error;
    }

    return [];
  }
}

async function findDonationsWithFallback(userId: string) {
  try {
    return await db.query.donations.findMany({
      where: eq(donations.userId, userId),
      orderBy: [desc(donations.createdAt)],
      limit: 10,
    });
  } catch (error) {
    if (!isMissingDbStructure(error, ["donations", "billing_cycle", "payment_status"])) {
      throw error;
    }

    return [];
  }
}

function getNormalizedPreferences(row: UserSettingsRecord) {
  const reading = {
    mode: row?.readerMode ?? defaultReadingSettings.mode,
    showTranslation: row?.showTranslation ?? defaultReadingSettings.showTranslation,
    showTransliteration: row?.showTransliteration ?? defaultReadingSettings.showTransliteration,
    arabicSize: row?.arabicFontSize ?? defaultReadingSettings.arabicSize,
  } as const;

  return {
    notifications: {
      readingReminders: row?.readingReminders ?? defaultNotificationSettings.readingReminders,
      hifzRepetitions: row?.hifzRepetitions ?? defaultNotificationSettings.hifzRepetitions,
      khatamDaily: row?.khatamDaily ?? defaultNotificationSettings.khatamDaily,
      marketing: row?.marketing ?? defaultNotificationSettings.marketing,
    },
    appearance: {
      theme: row?.theme ?? defaultAppearanceSettings.theme,
      mushafMode: reading.mode === "mushaf",
      fontSize: reading.arabicSize,
    },
    reading,
  };
}

function toBillingItems(rows: Array<typeof donations.$inferSelect>): SettingsBillingItem[] {
  return rows.map((row) => ({
    id: row.id,
    amount: row.amount,
    type: row.type,
    billingCycle: row.billingCycle,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getSettingsPageData(): Promise<SettingsPageData> {
  const session = await requireServerSession();
  return getSettingsPageDataForSession(session);
}

export async function getSettingsPageDataForSession(
  session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>,
): Promise<SettingsPageData> {
  const [profile, settings, sessions, donationRows] = await Promise.all([
    findUserProfileWithFallback(session.user.id),
    findUserSettingsWithFallback(session.user.id),
    findSessionsWithFallback(session.user.id),
    findDonationsWithFallback(session.user.id),
  ]);

  const preferences = getNormalizedPreferences(settings);
  const billingItems = toBillingItems(donationRows);
  const totalConfirmedAmount = billingItems
    .filter((item) => item.status === "confirmed")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalConfirmedCount = billingItems.filter((item) => item.status === "confirmed").length;
  const activeSupporter = billingItems.some(
    (item) => item.status === "confirmed" && item.type === "recurring",
  );
  const currentSessionId = (session as { session?: { id?: string } }).session?.id ?? null;

  return {
    appVersion: pkg.version,
    account: {
      fullName: session.user.name,
      email: session.user.email,
      username: profile?.username ?? "",
      location: profile?.location ?? "",
      bio: profile?.bio ?? "",
      dailyGoal: (profile?.dailyGoal as SettingsPageData["account"]["dailyGoal"] | undefined) ?? "build-consistency",
      emailVerified: session.user.emailVerified,
      memberSince: new Date(session.user.createdAt).toISOString(),
    },
    notifications: preferences.notifications,
    appearance: preferences.appearance,
    reading: preferences.reading,
    security: {
      sessions: sessions.map((item) => ({
        id: item.id,
        isCurrent: item.id === currentSessionId,
        userAgent: item.userAgent,
        ipAddress: item.ipAddress,
        lastSeenAt: item.updatedAt.toISOString(),
        expiresAt: item.expiresAt.toISOString(),
      })),
    },
    billing: {
      donations: billingItems,
      totalConfirmedAmount,
      totalConfirmedCount,
      activeSupporter,
    },
  };
}
