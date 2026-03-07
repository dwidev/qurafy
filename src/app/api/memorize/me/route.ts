import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getMemorizeMeData } from "@/features/memorize/server/memorize-data";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const payload = await getMemorizeMeData(session.user.id);
    return NextResponse.json(payload);
  } catch {
    return jsonError("Failed to load memorize data.", 500);
  }
}
