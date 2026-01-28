import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";
import { SuggestionStatus } from "@/lib/generated/prisma/client";

/**
 * GET /api/suggestions/[id]
 * Gets a single suggestion with details.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestion = await db.suggestion.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true },
        },
        assignee: {
          select: { name: true },
        },
        upvotes: {
          select: { userId: true },
        },
        _count: {
          select: { upvotes: true },
        },
      },
    });

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'STUDENT' && suggestion.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const formattedSuggestion = {
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      status: suggestion.status,
      response: suggestion.response,
      authorName: suggestion.user.name,
      assigneeName: suggestion.assignee?.name,
      assigneeId: suggestion.assigneeId,
      upvotes: suggestion._count.upvotes,
      createdAt: suggestion.createdAt.toISOString(),
      userUpvoted: suggestion.upvotes.some(u => u.userId === user.id),
    };

    return NextResponse.json(formattedSuggestion);
  } catch (error) {
    console.error("Get suggestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/suggestions/[id]
 * Updates a suggestion (staff/admin only).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== 'STAFF' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { status, response, assigneeId }: { status?: string; response?: string; assigneeId?: string } = await request.json();

    const updateData: {
      status?: SuggestionStatus;
      response?: string;
      assigneeId?: string;
    } = {};
    if (status) {
      const upperStatus = status.toUpperCase();
      if (!Object.keys(SuggestionStatus).includes(upperStatus)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      updateData.status = SuggestionStatus[upperStatus as keyof typeof SuggestionStatus];
    }
    if (response !== undefined) updateData.response = response;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const suggestion = await db.suggestion.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { name: true },
        },
        assignee: {
          select: { name: true },
        },
      },
    });

    // Log audit
    await logAuditEvent(
      user.id,
      'UPDATE',
      'Suggestion',
      suggestion.id,
      `Updated status to ${status} by ${user.name}`
    );

    return NextResponse.json({
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      status: suggestion.status,
      response: suggestion.response,
      assigneeName: suggestion.assignee?.name,
      assigneeId: suggestion.assigneeId,
      updatedAt: suggestion.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Update suggestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/suggestions/[id]
 * Deletes a suggestion (students can delete their own, staff/admin can delete any).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestion = await db.suggestion.findUnique({
      where: { id },
    });

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'STUDENT' && suggestion.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Staff and admin can delete any suggestion, students can only delete their own

    // Delete the suggestion
    await db.suggestion.delete({
      where: { id },
    });

    // Log audit event
    await logAuditEvent(
      user.id,
      'DELETE',
      'Suggestion',
      id,
      `Deleted suggestion: ${suggestion.title}`
    );

    return NextResponse.json({ message: "Suggestion deleted successfully" });
  } catch (error) {
    console.error("Delete suggestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
