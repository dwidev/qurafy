import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { deleteHabit, updateHabit } from "@/features/habits/server/habits-data";
import type { SaveHabitPayload } from "@/features/habits/types";

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

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const { habitId } = await context.params;
    const payload = await readJson<SaveHabitPayload>(request);
    const result = await updateHabit(session.user.id, {
      ...payload,
      habitId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/habits/[habitId]] Failed to update habit", error);

    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to update habit.", 400);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const { habitId } = await context.params;
    const result = await deleteHabit(session.user.id, habitId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/habits/[habitId]] Failed to delete habit", error);

    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to delete habit.", 400);
  }
}
