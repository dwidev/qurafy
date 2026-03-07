import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { completeMemorizeSession } from "@/features/memorize/server/memorize-data";
import type { CompleteMemorizeSessionPayload } from "@/features/memorize/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  let payload: CompleteMemorizeSessionPayload;

  try {
    payload = (await request.json()) as CompleteMemorizeSessionPayload;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const result = await completeMemorizeSession(session.user.id, payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to complete memorize session.", 500);
  }
}
