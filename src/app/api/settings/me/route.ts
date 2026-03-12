import { NextResponse } from "next/server";
import { getSettingsPageData } from "@/features/settings/server/settings-data";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    const data = await getSettingsPageData();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return jsonError("Failed to load settings.", 500);
  }
}
