import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/staff/chat/sessions
 * Returns escalated chat sessions for staff.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const sessions = await db.chatSession.findMany({
      where: {
        escalated: true,
        status: 'OPEN'
      },
      include: {
        user: {
          select: { id: true, name: true }
        },
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Get staff chat sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}