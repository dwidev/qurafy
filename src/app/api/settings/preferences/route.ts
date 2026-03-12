import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { requireServerSession } from "@/features/auth/server/session";
import {
  defaultNotificationSettings,
  defaultReadingSettings,
} from "@/features/settings/constants";
import {
  findUserSettingsWithFallback,
} from "@/features/settings/server/settings-data";
import type {
  AppearanceSettings,
  NotificationSettings,
  ReadingSettings,
} from "@/features/settings/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function savePreferences(input: {
  userId: string;
  theme: "light" | "dark" | "system";
  readerMode: "verse" | "mushaf";
  arabicSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  notifications: NotificationSettings;
  now: Date;
}) {
  await db
    .insert(userSettings)
    .values({
      userId: input.userId,
      theme: input.theme,
      readerMode: input.readerMode,
      arabicFontSize: input.arabicSize,
      showTranslation: input.showTranslation,
      showTransliteration: input.showTransliteration,
      readingReminders: input.notifications.readingReminders,
      hifzRepetitions: input.notifications.hifzRepetitions,
      khatamDaily: input.notifications.khatamDaily,
      marketing: input.notifications.marketing,
      createdAt: input.now,
      updatedAt: input.now,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        theme: input.theme,
        readerMode: input.readerMode,
        arabicFontSize: input.arabicSize,
        showTranslation: input.showTranslation,
        showTransliteration: input.showTransliteration,
        readingReminders: input.notifications.readingReminders,
        hifzRepetitions: input.notifications.hifzRepetitions,
        khatamDaily: input.notifications.khatamDaily,
        marketing: input.notifications.marketing,
        updatedAt: input.now,
      },
    });
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

  await savePreferences({
    userId: session.user.id,
    theme: theme as "light" | "dark" | "system",
    readerMode: readerMode as "verse" | "mushaf",
    arabicSize: reading.arabicSize,
    showTranslation: reading.showTranslation,
    showTransliteration: reading.showTransliteration,
    notifications,
    now,
  });

  const saved = await findUserSettingsWithFallback(session.user.id);

  return NextResponse.json({ ok: true, settings: saved });
}
