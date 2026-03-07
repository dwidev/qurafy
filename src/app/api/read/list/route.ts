import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getQuranReadListData } from "@/features/read/server/quran-api";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const payload = await getQuranReadListData();
    return NextResponse.json(payload);
  } catch {
    return jsonError("Failed to fetch Quran list from upstream API.", 502);
  }
}
