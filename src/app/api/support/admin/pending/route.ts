import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getPendingSupportTransactions, isSupportAdmin } from "@/features/support/server/support-data";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  if (!isSupportAdmin(session.user.email)) {
    return jsonError("Forbidden", 403);
  }

  const transactions = await getPendingSupportTransactions();

  return NextResponse.json({
    transactions,
  });
}
