import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { createSadaqahDonation } from "@/features/support/server/support-data";
import type { CreateSadaqahDonationPayload } from "@/features/support/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Please log in to continue with sadaqah.", 401);
  }

  const body = (await request.json()) as Partial<CreateSadaqahDonationPayload>;
  const amount = Number(body.amount);

  try {
    const donation = await createSadaqahDonation(session.user.id, {
      amount,
    });

    return NextResponse.json({
      ok: true,
      donation: donation.donation,
      transaction: donation.transaction,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process sadaqah.";
    return jsonError(message, 400);
  }
}
