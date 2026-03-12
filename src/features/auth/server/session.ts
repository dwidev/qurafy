import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      error.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }

    console.error("[auth/session] Failed to resolve server session", error);
    return null;
  }
});

export const requireServerSession = cache(async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
});
