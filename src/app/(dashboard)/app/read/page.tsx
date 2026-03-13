import { requireServerSession } from "@/features/auth/server/session";
import ReadQuranPage from "@/features/read/components/ReadQuranPage";
import { getQuranReadListData } from "@/features/read/server/quran-api";
import type { ReadListData } from "@/features/read/types";

export default async function ReadRoutePage() {
  await requireServerSession();
  let initialData: ReadListData | undefined;

  try {
    initialData = await getQuranReadListData();
  } catch (error) {
    console.error("[app/read] Failed to preload read list", error);
  }

  return <ReadQuranPage initialData={initialData} />;
}
