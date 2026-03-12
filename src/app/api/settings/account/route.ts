import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireServerSession } from "@/features/auth/server/session";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function DELETE(request: Request) {
  const session = await requireServerSession();
  const body = (await request.json()) as { confirmation?: string };

  if (body.confirmation !== "DELETE") {
    return jsonError("Type DELETE to confirm account deletion.", 400);
  }

  await db.delete(user).where(eq(user.id, session.user.id));

  return NextResponse.json({ ok: true });
}
