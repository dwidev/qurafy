import { requireServerSession } from "@/features/auth/server/session";
import TrackerPage from "@/features/tracker/components/TrackerPage";
import { getKhatamMeData } from "@/features/tracker/server/khatam-data";
import type { KhatamMeData } from "@/features/tracker/types";

export default async function TrackerRoutePage() {
  const session = await requireServerSession();
  let initialData: KhatamMeData | undefined;

  try {
    initialData = await getKhatamMeData(session.user.id);
  } catch (error) {
    console.error("[app/tracker] Failed to preload khatam data", error);
  }

  return <TrackerPage initialData={initialData} />;
}
