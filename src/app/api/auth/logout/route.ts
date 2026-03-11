import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { touchUserActivityLogout } from "@/features/dashboard/server/login-streak";
import { auth } from "@/lib/auth";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const result = await auth.api.signOut({
    headers: await headers(),
    returnHeaders: true,
  });

  try {
    await touchUserActivityLogout(session.user.id);
  } catch (error) {
    console.error("[api/auth/logout] Failed to touch user logout activity", error);
  }

  const response = NextResponse.json(result.response);

  result.headers.forEach((value, key) => {
    response.headers.append(key, value);
  });

  return response;
}
