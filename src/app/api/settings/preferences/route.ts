import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { requireServerSession } from "@/features/auth/server/session";
import {
  defaultNotificationSettings,
  defaultReadingSettings,
} from "@/features/settings/constants";
import type {
  AppearanceSettings,
  NotificationSettings,
  ReadingSettings,
} from "@/features/settings/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request) {
  const session = await requireServerSession();

  const body = (await request.json()) as {
    notifications?: NotificationSettings;
    appearance?: AppearanceSettings;
    reading?: ReadingSettings;
  };

  const notifications = body.notifications ?? defaultNotificationSettings;
  const reading = body.reading ?? defaultReadingSettings;
  const theme = body.appearance?.theme ?? "system";
  const readerMode = body.appearance?.mushafMode ? "mushaf" : reading.mode;

  if (!["light", "dark", "system"].includes(theme)) {
    return jsonError("Invalid theme.", 400);
  }

  if (!["verse", "mushaf"].includes(readerMode)) {
    return jsonError("Invalid reader mode.", 400);
  }

  if (reading.arabicSize < 1 || reading.arabicSize > 7) {
    return jsonError("Arabic font size must be between 1 and 7.", 400);
  }

  const now = new Date();

  await db
    .insert(userSettings)
    .values({
      userId: session.user.id,
      theme: theme as "light" | "dark" | "system",
      readerMode: readerMode as "verse" | "mushaf",
      arabicFontSize: reading.arabicSize,
      showTranslation: reading.showTranslation,
      showTransliteration: reading.showTransliteration,
      readingReminders: notifications.readingReminders,
      hifzRepetitions: notifications.hifzRepetitions,
      khatamDaily: notifications.khatamDaily,
      marketing: notifications.marketing,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        theme: theme as "light" | "dark" | "system",
        readerMode: readerMode as "verse" | "mushaf",
        arabicFontSize: reading.arabicSize,
        showTranslation: reading.showTranslation,
        showTransliteration: reading.showTransliteration,
        readingReminders: notifications.readingReminders,
        hifzRepetitions: notifications.hifzRepetitions,
        khatamDaily: notifications.khatamDaily,
        marketing: notifications.marketing,
        updatedAt: now,
      },
    });

  const saved = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, session.user.id),
  });

  return NextResponse.json({ ok: true, settings: saved });
}
