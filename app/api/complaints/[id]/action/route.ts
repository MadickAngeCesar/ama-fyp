import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";
import { ComplaintStatus } from "@/lib/generated/prisma/client";

/**
 * POST /api/complaints/[id]/action
 * Performs staff actions on a complaint (update status, add response, assign).
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

    const complaintId = id;

    // Check if complaint exists
    const complaint = await db.complaint.findUnique({
      where: { id: complaintId },
      include: { user: true },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    const updateData: {
      status?: ComplaintStatus;
      response?: string;
      assigneeId?: string;
    } = {};

    let auditDetail = '';

    switch (action) {
      case 'assign':
        // assigneeId can be empty string for unassignment
        updateData.assigneeId = assigneeId || undefined;
        auditDetail = assigneeId ? `Assigned to staff member` : `Unassigned from staff member`;
        break;

      case 'update_status':
        if (!status) {
          return NextResponse.json({ error: "Status is required for update_status action" }, { status: 400 });
        }
        updateData.status = status as ComplaintStatus;
        auditDetail = `Status changed to ${status}`;
        break;

      case 'respond':
        if (!response) {
          return NextResponse.json({ error: "Response is required for respond action" }, { status: 400 });
        }
        updateData.response = response;
        updateData.status = 'RESOLVED'; // Auto-resolve when responding
        auditDetail = `Response added: ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`;
        break;

      case 'close':
        updateData.status = 'CLOSED';
        auditDetail = 'Complaint closed';
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update the complaint
    const updatedComplaint = await db.complaint.update({
      where: { id: complaintId },
      data: updateData,
      include: {
        user: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    });

    // Log audit event
    await logAuditEvent(
      user.id,
      action.toUpperCase(),
      'Complaint',
      complaintId,
      auditDetail
    );

    return NextResponse.json({
      id: updatedComplaint.id,
      category: updatedComplaint.category,
      description: updatedComplaint.description,
      status: updatedComplaint.status,
      response: updatedComplaint.response,
      attachment: updatedComplaint.attachment,
      authorName: updatedComplaint.user.name,
      assigneeName: updatedComplaint.assignee?.name,
      createdAt: updatedComplaint.createdAt.toISOString(),
      updatedAt: updatedComplaint.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Complaint action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}