import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { upsertHabitEntry } from "@/features/habits/server/habits-data";
import type { UpsertHabitEntryPayload } from "@/features/habits/types";

type RouteContext = {
  params: Promise<{
    habitId: string;
  }>;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function readJson<T>(request: NextRequest) {
  return (await request.json()) as T;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const { habitId } = await context.params;
    const payload = await readJson<Omit<UpsertHabitEntryPayload, "habitId">>(request);
    const result = await upsertHabitEntry(session.user.id, {
      ...payload,
      habitId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/habits/[habitId]/entry] Failed to save habit entry", error);

    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to save habit progress.", 400);
  }
}
