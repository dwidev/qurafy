import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "@/features/auth/server/session";
import { recreateKhatamPlanFromHistory } from "@/features/tracker/server/khatam-data";
import type { RecreateKhatamPlanPayload } from "@/features/tracker/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  let payload: RecreateKhatamPlanPayload;

  try {
    payload = (await request.json()) as RecreateKhatamPlanPayload;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const result = await recreateKhatamPlanFromHistory(session.user.id, payload);
    revalidateTag(`dashboard-view-data:${session.user.id}`, "max");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to recreate khatam plan.", 500);
  }
}
