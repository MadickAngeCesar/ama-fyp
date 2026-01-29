import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateChatResponse } from "@/lib/actions";
import { MessageSender } from "@/lib/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { withAiRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/chat
 * Handles sending a chat message and getting AI response.
 * Creates or updates a chat session.
 */
export async function POST(request: NextRequest) {
  // Apply AI rate limiting (10 requests per minute)
  const rateLimitResponse = await withAiRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, message }: { sessionId?: string; message: string } =
      await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await db.chatSession.findUnique({
        where: { id: sessionId, userId: user.id },
      });
      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
    } else {
      // Create new session
      session = await db.chatSession.create({
        data: {
          userId: user.id,
          title: message.slice(0, 50), // Use first 50 chars as title
        },
      });
    }

    // Fetch context: recent non-PII data (e.g., user's recent complaints/suggestions)
    const recentComplaints = await db.complaint.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        category: true,
        status: true,
        createdAt: true,
      },
    });

    const recentSuggestions = await db.suggestion.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        title: true,
        status: true,
        createdAt: true,
      },
    });

    const context = `
Recent complaints: ${recentComplaints
      .map((c) => `${c.category} - ${c.status} (${c.createdAt.toDateString()})`)
      .join(", ")}

Recent suggestions: ${recentSuggestions
      .map((s) => `${s.title} - ${s.status} (${s.createdAt.toDateString()})`)
      .join(", ")}
`;

    // Persist user message
    await db.message.create({
      data: {
        sessionId: session.id,
        sender: MessageSender.USER,
        content: message,
      },
    });

    // Generate AI response
    const aiResponse = await generateChatResponse(message, context);

    // Persist AI message
    await db.message.create({
      data: {
        sessionId: session.id,
        sender: MessageSender.AI,
        content: aiResponse,
      },
    });

    // Update session lastActivity
    await db.chatSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    return NextResponse.json({
      sessionId: session.id,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}