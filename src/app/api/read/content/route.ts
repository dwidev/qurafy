import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/features/auth/server/session";
import { getQuranReadContentData } from "@/features/read/server/quran-api";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const idParam = request.nextUrl.searchParams.get("id");

  if (!idParam || idParam.trim().length === 0) {
    return jsonError("Missing id query parameter.", 400);
  }

  const id = idParam.trim();

  let data = null;

  try {
    data = await getQuranReadContentData(id);
  } catch {
    return jsonError("Failed to fetch Quran content from upstream API.", 502);
  }

  if (!data) {
    return jsonError("Read content not found.", 404);
  }

  return NextResponse.json(data);
}
