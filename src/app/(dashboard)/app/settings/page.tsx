import { requireServerSession } from "@/features/auth/server/session";
import SettingsPage from "@/features/settings/components/SettingsPage";
import { getSettingsPageDataForSession } from "@/features/settings/server/settings-data";
import type { SettingsPageData } from "@/features/settings/types";

export default async function SettingsRoutePage() {
  const session = await requireServerSession();
  let initialData: SettingsPageData | undefined;

  try {
    initialData = await getSettingsPageDataForSession(session);
  } catch (error) {
    console.error("[app/settings] Failed to preload settings data", error);
  }

  return <SettingsPage initialData={initialData} />;
}
