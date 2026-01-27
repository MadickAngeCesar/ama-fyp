import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";
import { SuggestionStatus } from "@/lib/generated/prisma/client";

/**
 * POST /api/suggestions/[id]/action
 * Performs staff actions on a suggestion (update status, add response).
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

    if (user.role !== 'STAFF' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { action, status, response, assigneeId }: {
      action: string;
      status?: string;
      response?: string;
      assigneeId?: string;
    } = await request.json();

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const suggestionId = id;

    // Check if suggestion exists
    const suggestion = await db.suggestion.findUnique({
      where: { id: suggestionId },
      include: { user: true },
    });

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }

    const updateData: {
      status?: SuggestionStatus;
      response?: string;
      assigneeId?: string;
    } = {};
    let auditDetail = '';

    switch (action) {
      case 'update_status':
        if (!status) {
          return NextResponse.json({ error: "Status is required for update_status action" }, { status: 400 });
        }
        const upperStatus = status.toUpperCase();
        if (!Object.keys(SuggestionStatus).includes(upperStatus)) {
          return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }
        updateData.status = SuggestionStatus[upperStatus as keyof typeof SuggestionStatus];
        auditDetail = `Updated status to ${upperStatus}`;
        break;
      case 'add_response':
        if (!response) {
          return NextResponse.json({ error: "Response is required for add_response action" }, { status: 400 });
        }
        updateData.response = response;
        auditDetail = `Added response: ${response.slice(0, 50)}...`;
        break;
      case 'approve':
        updateData.status = SuggestionStatus.APPROVED;
        auditDetail = 'Approved suggestion';
        break;
      case 'reject':
        updateData.status = SuggestionStatus.REJECTED;
        auditDetail = 'Rejected suggestion';
        break;
      case 'assign':
        if (!assigneeId) {
          return NextResponse.json({ error: "Assignee ID is required for assign action" }, { status: 400 });
        }
        updateData.assigneeId = assigneeId;
        auditDetail = `Assigned to staff member`;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update suggestion
    const updatedSuggestion = await db.suggestion.update({
      where: { id: suggestionId },
      data: updateData,
    });

    // Log audit
    await logAuditEvent(
      user.id,
      action.toUpperCase(),
      'Suggestion',
      suggestionId,
      auditDetail
    );

    // TODO: Send notification to student (email/in-app)

    return NextResponse.json({
      id: updatedSuggestion.id,
      status: updatedSuggestion.status,
      response: updatedSuggestion.response,
      assigneeId: updatedSuggestion.assigneeId,
      updatedAt: updatedSuggestion.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Suggestion action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}