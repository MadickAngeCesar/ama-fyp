import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";

/**
 * GET /api/complaints/[id]
 * Gets a single complaint with details.
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

    const complaint = await db.complaint.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true },
        },
        assignee: {
          select: { name: true },
        },
        auditLogs: {
          include: {
            actor: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'STUDENT' && complaint.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const formattedComplaint = {
      id: complaint.id,
      category: complaint.category,
      description: complaint.description,
      status: complaint.status,
      response: complaint.response,
      attachment: complaint.attachment,
      authorName: complaint.user.name,
      assigneeName: complaint.assignee?.name,
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString(),
      auditLogs: complaint.auditLogs.map(log => ({
        id: log.id,
        action: log.action,
        detail: log.detail,
        actorName: log.actor?.name || 'System',
        createdAt: log.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(formattedComplaint);
  } catch (error) {
    console.error("Get complaint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/complaints/[id]
 * Updates a complaint (students can update their own, staff can update assigned).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, description }: {
      category?: string;
      description?: string;
    } = await request.json();

    // Check if complaint exists and user has permission
    const complaint = await db.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Students can only update their own complaints
    if (user.role === 'STUDENT' && complaint.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Staff can only update assigned complaints or if they're admin
    if (user.role === 'STAFF' && complaint.assigneeId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Only allow updates to certain fields for students
    const updateData: {
      category?: string;
      description?: string;
    } = {};

    if (user.role === 'STUDENT') {
      // Students can only update category and description, and only if status is PENDING
      if (complaint.status !== 'PENDING') {
        return NextResponse.json(
          { error: "Cannot update complaint that is already being processed" },
          { status: 400 }
        );
      }
      if (category) updateData.category = category;
      if (description) updateData.description = description;
    } else {
      // Staff/Admin can update category and description
      if (category) updateData.category = category;
      if (description) updateData.description = description;
    }

    const updatedComplaint = await db.complaint.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    });

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
    console.error("Update complaint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/complaints/[id]
 * Deletes a complaint (students can delete their own, staff/admin can delete any).
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

    const complaint = await db.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'STUDENT' && complaint.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Staff and admin can delete any complaint, students can only delete their own

    // Delete the complaint
    await db.complaint.delete({
      where: { id },
    });

    // Log audit event
    await logAuditEvent(
      user.id,
      'DELETE',
      'Complaint',
      id,
      `Deleted complaint: ${complaint.category}`
    );

    return NextResponse.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Delete complaint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}