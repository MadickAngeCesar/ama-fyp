import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";

/**
 * POST /api/suggestions/[id]/upvote
 * Toggles upvote for a suggestion.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestionId = id;

    // Check if suggestion exists
    const suggestion = await db.suggestion.findUnique({
      where: { id: suggestionId },
    });

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    // Check if user already upvoted
    const existingUpvote = await db.upvote.findUnique({
      where: {
        userId_suggestionId: {
          userId: user.id,
          suggestionId,
        },
      },
    });

    if (existingUpvote) {
      // Remove upvote
      await db.upvote.delete({
        where: { id: existingUpvote.id },
      });

      // Log audit
      await logAuditEvent(user.id, 'REMOVE_UPVOTE', 'Suggestion', suggestionId, `Removed upvote from suggestion`);

      return NextResponse.json({ upvoted: false });
    } else {
      // Add upvote
      await db.upvote.create({
        data: {
          userId: user.id,
          suggestionId,
        },
      });

      // Log audit
      await logAuditEvent(user.id, 'UPVOTE', 'Suggestion', suggestionId, `Upvoted suggestion`);

      return NextResponse.json({ upvoted: true });
    }
  } catch (error) {
    console.error("Upvote suggestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}