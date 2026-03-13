import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getDashboardMeDataForSession } from "@/features/dashboard/server/dashboard-me";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  return NextResponse.json(await getDashboardMeDataForSession(session));
}
