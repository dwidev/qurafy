import { requireServerSession } from "@/features/auth/server/session";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { getDashboardMeDataForSession } from "@/features/dashboard/server/dashboard-me";
import type { DashboardMeData } from "@/features/dashboard/types";

export default async function AppDashboardPage() {
  const session = await requireServerSession();
  let initialData: DashboardMeData | undefined;

  try {
    initialData = await getDashboardMeDataForSession(session);
  } catch (error) {
    console.error("[app/dashboard] Failed to preload dashboard data", error);
  }

  return <DashboardPage initialData={initialData} />;
}
