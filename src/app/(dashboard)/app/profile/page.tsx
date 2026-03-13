import { requireServerSession } from "@/features/auth/server/session";
import { ProfilePageClient } from "@/features/profile/components/ProfilePageClient";
import { getProfileMeDataForSession } from "@/features/profile/server/profile-data";
import { getSettingsPageDataForSession } from "@/features/settings/server/settings-data";
import type { ProfileMeData } from "@/features/profile/types";
import type { SettingsPageData } from "@/features/settings/types";

export default async function ProfilePage() {
  const session = await requireServerSession();
  const [initialDataResult, initialSettingsDataResult] = await Promise.allSettled([
    getProfileMeDataForSession(session),
    getSettingsPageDataForSession(session),
  ]);
  const initialData: ProfileMeData | undefined =
    initialDataResult.status === "fulfilled" ? initialDataResult.value : undefined;
  const initialSettingsData: SettingsPageData | undefined =
    initialSettingsDataResult.status === "fulfilled" ? initialSettingsDataResult.value : undefined;

  if (initialDataResult.status === "rejected") {
    console.error("[app/profile] Failed to preload profile data", initialDataResult.reason);
  }

  if (initialSettingsDataResult.status === "rejected") {
    console.error("[app/profile] Failed to preload settings data", initialSettingsDataResult.reason);
  }

  return <ProfilePageClient initialData={initialData} initialSettingsData={initialSettingsData} />;
}
