import { redirect } from "next/navigation";
import AdminSupportTransactionDetailPage from "@/features/support/components/AdminSupportTransactionDetailPage";
import { getServerSession } from "@/features/auth/server/session";
import {
  getAdminSupportTransactionDetail,
  isSupportAdmin,
} from "@/features/support/server/support-data";
import type { AdminSupportTransactionTab } from "@/features/support/types";

function normalizeTab(value: string | undefined): AdminSupportTransactionTab {
  if (value === "success" || value === "cancel") {
    return value;
  }

  return "pending";
}

export default async function AdminSupportTransactionRoutePage({
  params,
  searchParams,
}: {
  params: Promise<{
    transactionId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (!isSupportAdmin(session.user.email)) {
    redirect("/app");
  }

  const [{ transactionId }, query] = await Promise.all([params, searchParams]);
  const activeTab = normalizeTab(query.tab);
  const backHref = activeTab === "pending" ? "/admin/support" : `/admin/support?tab=${activeTab}`;

  let transaction = null;
  let errorMessage: string | null = null;

  try {
    transaction = await getAdminSupportTransactionDetail(transactionId);

    if (!transaction) {
      errorMessage = "Transaction not found.";
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load transaction detail.";
  }

  return (
    <AdminSupportTransactionDetailPage
      transaction={transaction}
      errorMessage={errorMessage}
      backHref={backHref}
    />
  );
}
