import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { createMemorizeGoal } from "@/features/memorize/server/memorize-data";
import type { CreateMemorizeGoalPayload } from "@/features/memorize/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  let payload: CreateMemorizeGoalPayload;

  try {
    payload = (await request.json()) as CreateMemorizeGoalPayload;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const result = await createMemorizeGoal(session.user.id, payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to create memorize goal.", 500);
  }
}
