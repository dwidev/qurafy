import { redirect } from "next/navigation";
import AdminSupportPage from "@/features/support/components/AdminSupportPage";
import { getServerSession } from "@/features/auth/server/session";
import { isSupportAdmin } from "@/features/support/server/support-data";

export default async function AdminSupportRoutePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (!isSupportAdmin(session.user.email)) {
    redirect("/app");
  }

  return <AdminSupportPage />;
}
