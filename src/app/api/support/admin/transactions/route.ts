import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getAdminSupportTransactions, isSupportAdmin } from "@/features/support/server/support-data";
import type { AdminSupportTransactionTab } from "@/features/support/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeTab(value: string | null): AdminSupportTransactionTab {
  if (value === "success" || value === "cancel") {
    return value;
  }

  return "pending";
}

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  if (!isSupportAdmin(session.user.email)) {
    return jsonError("Forbidden", 403);
  }

  const { searchParams } = new URL(request.url);
  const tab = normalizeTab(searchParams.get("tab"));
  const transactions = await getAdminSupportTransactions(tab);

  return NextResponse.json({
    tab,
    transactions,
  });
}
