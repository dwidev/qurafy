import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { createHabit } from "@/features/habits/server/habits-data";
import type { SaveHabitPayload } from "@/features/habits/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function readJson<T>(request: NextRequest) {
  return (await request.json()) as T;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const payload = await readJson<SaveHabitPayload>(request);
    const result = await createHabit(session.user.id, payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[api/habits] Failed to create habit", error);

    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to create habit.", 400);
  }
}
