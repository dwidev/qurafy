import { redirect } from "next/navigation";
import TransferPage from "@/features/support/components/TransferPage";
import { getServerSession } from "@/features/auth/server/session";
import { getSupportTransferPageDataByTransaction } from "@/features/support/server/support-data";

export default async function TransferRoutePage({
  searchParams,
}: {
  searchParams: Promise<{
    tx?: string;
  }>;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const transactionId = params.tx;

  if (!transactionId) {
    return <TransferPage data={null} errorMessage="Missing transfer transaction." />;
  }

  let data = null;
  let errorMessage: string | null = null;

  try {
    data = await getSupportTransferPageDataByTransaction(session.user.id, transactionId);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load transfer request.";
  }

  return <TransferPage data={data} errorMessage={errorMessage} />;
}
