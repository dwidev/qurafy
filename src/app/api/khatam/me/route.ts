import { NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getKhatamMeData } from "@/features/tracker/server/khatam-data";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const payload = await getKhatamMeData(session.user.id);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[api/khatam/me] Failed to load khatam data", error);

    if (process.env.NODE_ENV !== "production" && error instanceof Error) {
      return jsonError(error.message, 500);
    }

    return jsonError("Failed to load khatam data.", 500);
  }
}
