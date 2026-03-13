import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { submitTransactionProof } from "@/features/support/server/support-data";
import type { SubmitTransactionProofPayload } from "@/features/support/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Please log in to submit transfer proof.", 401);
  }

  const body = (await request.json()) as Partial<SubmitTransactionProofPayload>;

  if (!body.transactionId) {
    return jsonError("Missing transaction ID.", 400);
  }

  try {
    const transaction = await submitTransactionProof(session.user.id, {
      transactionId: body.transactionId,
      proofUrl: body.proofUrl ?? "",
      notes: body.notes ?? "",
    });

    return NextResponse.json({
      ok: true,
      transaction,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit transfer proof.";
    return jsonError(message, 400);
  }
}
