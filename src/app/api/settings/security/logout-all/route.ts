import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { session as authSession } from "@/db/schema";
import { requireServerSession } from "@/features/auth/server/session";

export async function POST() {
  const session = await requireServerSession();

  await db.delete(authSession).where(eq(authSession.userId, session.user.id));

  return NextResponse.json({ ok: true });
}
