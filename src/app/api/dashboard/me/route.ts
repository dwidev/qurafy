import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "@/features/auth/server/session";
import { touchUserLoginDay } from "@/features/dashboard/server/login-streak";
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

  try {
    const createdLoginDay = await touchUserLoginDay(session.user.id);

    if (createdLoginDay) {
      revalidateTag(`dashboard-view-data:${session.user.id}`, "max");
    }
  } catch (error) {
    console.error("[api/dashboard/me] Failed to touch login streak", error);
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
