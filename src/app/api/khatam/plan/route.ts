import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "@/features/auth/server/session";
import {
  createKhatamPlan,
  deleteKhatamPlan,
  updateKhatamPlan,
} from "@/features/tracker/server/khatam-data";
import type {
  CreateKhatamPlanPayload,
  DeleteKhatamPlanPayload,
  UpdateKhatamPlanPayload,
} from "@/features/tracker/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  let payload: CreateKhatamPlanPayload;

  try {
    payload = (await request.json()) as CreateKhatamPlanPayload;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const result = await createKhatamPlan(session.user.id, payload);
    revalidateTag(`dashboard-view-data:${session.user.id}`, "max");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to create khatam plan.", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  let payload: UpdateKhatamPlanPayload;

  try {
    payload = (await request.json()) as UpdateKhatamPlanPayload;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const result = await updateKhatamPlan(session.user.id, payload);
    revalidateTag(`dashboard-view-data:${session.user.id}`, "max");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to update khatam plan.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  let payload: DeleteKhatamPlanPayload;

  try {
    payload = (await request.json()) as DeleteKhatamPlanPayload;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const result = await deleteKhatamPlan(session.user.id, payload);
    revalidateTag(`dashboard-view-data:${session.user.id}`, "max");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message, 400);
    }

    return jsonError("Failed to delete khatam plan.", 500);
  }
}
