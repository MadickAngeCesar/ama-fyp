import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { db } from "@/lib/db";
import { ComplaintStatus } from "@/lib/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/chat/[id]/escalate
 * Escalates a chat session to a formal complaint.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Verify session belongs to user
    const session = await db.chatSession.findUnique({
      where: { id: sessionId, userId: user.id },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 10 } },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Create complaint from chat context
    const lastUserMessage = session.messages.find(
      (msg) => msg.sender === "USER"
    );
    const description = lastUserMessage
      ? `Escalated from chat: ${lastUserMessage.content}`
      : "Escalated chat session";

    const complaint = await db.complaint.create({
      data: {
        userId: user.id,
        category: "General", // Default category, could be improved
        description,
        status: ComplaintStatus.PENDING,
      },
    });

    // Close the chat session
    await db.chatSession.update({
      where: { id: sessionId },
      data: { status: "CLOSED" },
    });

    // TODO: Enqueue background job for staff notification

    return NextResponse.json({ complaintId: complaint.id }, { status: 201 });
  } catch (error) {
    console.error("Escalate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}