import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/stats
 * Returns dashboard statistics for admin.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get counts
    const [userCount, complaintCount, suggestionCount, auditLogCount] = await Promise.all([
      db.user.count(),
      db.complaint.count(),
      db.suggestion.count(),
      db.auditLog.count(),
    ]);

    // Get recent activities
    const recentActivities = await db.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { name: true },
        },
      },
    });

    const formattedActivities = recentActivities.map(log => ({
      id: log.id,
      actorId: log.actorId,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      detail: log.detail,
      createdAt: log.createdAt.toISOString(),
      actor: log.actor?.name || 'System',
    }));

    return NextResponse.json({
      users: userCount,
      complaints: complaintCount,
      suggestions: suggestionCount,
      auditLogs: auditLogCount,
      recentActivities: formattedActivities,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}