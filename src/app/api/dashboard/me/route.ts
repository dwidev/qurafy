import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getDashboardViewData } from "@/features/dashboard/server/dashboard-data";
import type { DashboardMeData } from "@/features/dashboard/types";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const dashboard = await getDashboardViewData(session.user.id);

  const payload: DashboardMeData = {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      createdAt: new Date(session.user.createdAt).toISOString(),
    },
    dashboard,
  };

  return NextResponse.json(payload);
}
