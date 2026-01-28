import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";
import { ComplaintStatus } from "@/lib/generated/prisma/client";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/complaints
 * Lists complaints based on user role.
 * Students see their own complaints.
 * Staff/Admin see all complaints.
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
    const category = searchParams.get('category');

    const where: {
      status?: ComplaintStatus;
      userId?: string;
      category?: string;
    } = {};

    if (status) {
      where.status = status as ComplaintStatus;
    }

    if (category) {
      where.category = category;
    }

    if (userId && (user.role === 'ADMIN' || user.role === 'STAFF')) {
      where.userId = userId;
    } else if (user.role === 'STUDENT') {
      // Students can only see their own complaints
      where.userId = user.id;
    }

    const complaints = await db.complaint.findMany({
      where,
      include: {
        user: {
          select: { name: true },
        },
        assignee: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedComplaints = complaints.map(c => ({
      id: c.id,
      category: c.category,
      description: c.description,
      status: c.status,
      response: c.response,
      attachment: c.attachment,
      authorName: c.user.name,
      assigneeName: c.assignee?.name,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedComplaints);
  } catch (error) {
    console.error("Get complaints error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/complaints
 * Creates a new complaint with optional attachment.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const attachment = formData.get('attachment') as File | null;

    if (!category || !description) {
      return NextResponse.json(
        { error: "Category and description are required" },
        { status: 400 }
      );
    }

    let attachmentPath: string | undefined;

    // Handle file upload if present
    if (attachment) {
      const supabase = await createClient();
      const fileName = `${Date.now()}-${attachment.name}`;
      const { data, error } = await supabase.storage
        .from('complaints')
        .upload(fileName, attachment);

      if (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
          { error: "Failed to upload attachment" },
          { status: 500 }
        );
      }

      attachmentPath = data.path;
    }

    // Create complaint
    const complaint = await db.complaint.create({
      data: {
        userId: user.id,
        category,
        description,
        attachment: attachmentPath,
      },
    });

    // Log audit event
    await logAuditEvent(
      user.id,
      'CREATE',
      'Complaint',
      complaint.id,
      `Created complaint in category: ${category}`
    );

    return NextResponse.json({
      id: complaint.id,
      category: complaint.category,
      description: complaint.description,
      status: complaint.status,
      attachment: complaint.attachment,
      createdAt: complaint.createdAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("Create complaint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}