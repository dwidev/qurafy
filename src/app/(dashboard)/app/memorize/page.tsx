import { requireServerSession } from "@/features/auth/server/session";
import MemorizePage from "@/features/memorize/components/MemorizePage";
import { getMemorizeMeData } from "@/features/memorize/server/memorize-data";
import type { MemorizeMeData } from "@/features/memorize/types";

export default async function MemorizeRoutePage() {
  const session = await requireServerSession();
  let initialData: MemorizeMeData | undefined;

  try {
    initialData = await getMemorizeMeData(session.user.id);
  } catch (error) {
    console.error("[app/memorize] Failed to preload memorize data", error);
  }

  return <MemorizePage initialData={initialData} />;
}
