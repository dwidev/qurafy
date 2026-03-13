import { getDashboardViewData, getDashboardViewDataUncached } from "@/features/dashboard/server/dashboard-data";
import { touchUserActivityLogin } from "@/features/dashboard/server/login-streak";
import type { DashboardMeData } from "@/features/dashboard/types";
import type { getServerSession } from "@/features/auth/server/session";

type ServerSession = NonNullable<Awaited<ReturnType<typeof getServerSession>>>;

export async function getDashboardMeDataForSession(session: ServerSession): Promise<DashboardMeData> {
  let createdLoginDay = false;

  try {
    createdLoginDay = await touchUserActivityLogin(session.user.id);
  } catch (error) {
    console.error("[dashboard/me] Failed to touch user activity", error);
  }

  const dashboard = createdLoginDay
    ? await getDashboardViewDataUncached(session.user.id)
    : await getDashboardViewData(session.user.id);

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      createdAt: new Date(session.user.createdAt).toISOString(),
    },
    dashboard,
  };
}
