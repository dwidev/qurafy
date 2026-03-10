import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "@/features/auth/server/session";
import { createMemorizeGoal, deleteMemorizeGoal } from "@/features/memorize/server/memorize-data";
import type { CreateMemorizeGoalPayload, DeleteMemorizeGoalPayload } from "@/features/memorize/types";

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
    revalidateTag(`dashboard-view-data:${session.user.id}`, "max");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to create memorize goal.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  let payload: DeleteMemorizeGoalPayload;

  try {
    payload = (await request.json()) as DeleteMemorizeGoalPayload;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const result = await deleteMemorizeGoal(session.user.id, payload);
    revalidateTag(`dashboard-view-data:${session.user.id}`, "max");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to delete memorize goal.", 500);
  }
}
