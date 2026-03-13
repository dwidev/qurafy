import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getProfileMeDataForSession } from "@/features/profile/server/profile-data";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  return NextResponse.json(await getProfileMeDataForSession(session));
}
