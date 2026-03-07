import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export const requireServerSession = cache(async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
});
