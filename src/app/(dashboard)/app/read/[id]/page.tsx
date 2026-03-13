import { requireServerSession } from "@/features/auth/server/session";
import ReaderPage from "@/features/read/components/ReaderPage";
import { getQuranReadContentData } from "@/features/read/server/quran-api";
import type { ReadContentData } from "@/features/read/types";

export default async function ReaderRoutePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  await requireServerSession();
  const { id } = await params;
  let initialData: ReadContentData | null | undefined;

  try {
    initialData = await getQuranReadContentData(id);
  } catch (error) {
    console.error("[app/read/[id]] Failed to preload read content", error);
  }

  return <ReaderPage initialData={initialData ?? undefined} />;
}
