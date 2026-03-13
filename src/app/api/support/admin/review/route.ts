import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import {
  approveSupportTransaction,
  isSupportAdmin,
  rejectSupportTransaction,
} from "@/features/support/server/support-data";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  if (!isSupportAdmin(session.user.email)) {
    return jsonError("Forbidden", 403);
  }

  const body = (await request.json()) as {
    transactionId?: string;
    action?: "approve" | "reject";
    reason?: string;
  };

  if (!body.transactionId || (body.action !== "approve" && body.action !== "reject")) {
    return jsonError("Invalid review payload.", 400);
  }

  try {
    const transaction =
      body.action === "approve"
        ? await approveSupportTransaction(body.transactionId, session.user.id)
        : await rejectSupportTransaction(body.transactionId, session.user.id, body.reason);

    return NextResponse.json({
      ok: true,
      transaction,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to review transaction.";
    return jsonError(message, 400);
  }
}
