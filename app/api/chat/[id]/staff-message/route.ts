import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MessageSender } from "@/lib/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/chat/[id]/staff-message
 * Allows staff to send messages in a chat session.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id: sessionId } = await params;
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Verify session exists and is escalated
    const session = await db.chatSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!session.escalated) {
      return NextResponse.json({ error: "Session not escalated to staff" }, { status: 400 });
    }

    // Create staff message
    await db.message.create({
      data: {
        sessionId: session.id,
        sender: MessageSender.STAFF,
        content: message,
        metadata: { staffId: user.id, staffName: user.name }
      },
    });

    // Update session lastActivity
    await db.chatSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    // Create notification for the student
    await db.notification.create({
      data: {
        userId: session.userId,
        title: "New message from staff",
        body: `Staff responded to your chat: ${message.slice(0, 100)}${message.length > 100 ? '...' : ''}`,
        type: 'MESSAGE' as const,
        relatedId: session.id,
        relatedType: 'chat_session',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Staff message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}