import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/chat/[id]/request-staff
 * Requests staff assistance for a chat session.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Verify session belongs to user
    const session = await db.chatSession.findUnique({
      where: { id: sessionId, userId: user.id },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Mark session as escalated
    await db.chatSession.update({
      where: { id: sessionId },
      data: { escalated: true },
    });

    // Create notification for all staff members
    const staffMembers = await db.user.findMany({
      where: { role: { in: ['STAFF', 'ADMIN'] } },
    });

    const notifications = staffMembers.map(staff => ({
      userId: staff.id,
      title: "Student requested assistance",
      body: `A student needs help with their chat session: "${session.title || 'Untitled'}"`,
      type: 'MESSAGE' as const,
      relatedId: session.id,
      relatedType: 'chat_session',
    }));

    await db.notification.createMany({
      data: notifications,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Request staff error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}