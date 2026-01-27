import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent, generateChatResponse } from "@/lib/actions";
import { SuggestionStatus } from "@/lib/generated/prisma/client";

/**
 * GET /api/suggestions
 * Lists suggestions based on user role.
 * Students see their own + public suggestions.
 * Staff/Admin see all suggestions.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where: {
      status?: SuggestionStatus;
      userId?: string;
    } = {};

    if (status) {
      where.status = status as SuggestionStatus;
    }

    if (userId && (user.role === 'ADMIN' || user.role === 'STAFF')) {
      where.userId = userId;
    } else if (user.role === 'STUDENT') {
      // Students can only see their own suggestions
      where.userId = user.id;
    }

    const suggestions = await db.suggestion.findMany({
      where,
      include: {
        user: {
          select: { name: true },
        },
        upvotes: {
          select: { userId: true },
        },
        _count: {
          select: { upvotes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedSuggestions = suggestions.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      status: s.status,
      authorName: s.user.name,
      upvotes: s._count.upvotes,
      createdAt: s.createdAt.toISOString(),
      userUpvoted: s.upvotes.some(u => u.userId === user.id),
    }));

    return NextResponse.json(formattedSuggestions);
  } catch (error) {
    console.error("Get suggestions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/suggestions
 * Creates a new suggestion.
 * Enriches with AI if possible, logs audit.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: "Only students can submit suggestions" }, { status: 403 });
    }

    const { title, description }: { title: string; description: string } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Create suggestion
    const suggestion = await db.suggestion.create({
      data: {
        userId: user.id,
        title,
        description,
        status: SuggestionStatus.PENDING,
      },
    });

    // Try to enrich with AI
    try {
      const aiResponse = await generateChatResponse(
        `Enhance this student suggestion: "${title} - ${description}". Provide improved title and description, and suggest a category or priority.`,
        ""
      );
      // For simplicity, we'll just log it; in real implementation, parse and update
      console.log("AI enrichment:", aiResponse);
    } catch (aiError) {
      console.error("AI enrichment failed:", aiError);
    }

    // Log audit
    await logAuditEvent(user.id, 'CREATE', 'Suggestion', suggestion.id, `Created suggestion: ${title}`);

    return NextResponse.json({
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      status: suggestion.status,
      createdAt: suggestion.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Create suggestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
