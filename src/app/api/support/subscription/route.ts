import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { createSupporterSubscription } from "@/features/support/server/support-data";
import type { CreateSupporterSubscriptionPayload } from "@/features/support/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Please log in to start a supporter plan.", 401);
  }

  const body = (await request.json()) as Partial<CreateSupporterSubscriptionPayload>;
  const amount = Number(body.amount);
  const billingCycle = body.billingCycle;

  if (billingCycle !== "monthly" && billingCycle !== "yearly") {
    return jsonError("Invalid billing cycle.", 400);
  }

  try {
    const subscription = await createSupporterSubscription(session.user.id, {
      amount,
      billingCycle,
    });

    return NextResponse.json({
      ok: true,
      subscription: subscription.subscription,
      transaction: subscription.transaction,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start supporter plan.";
    return jsonError(message, 400);
  }
}
