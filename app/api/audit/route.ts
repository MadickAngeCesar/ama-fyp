import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/audit
 * Lists audit logs for admin users.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: {
      action?: string;
      entity?: string;
    } = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;

    const auditLogs = await db.auditLog.findMany({
      where,
      include: {
        actor: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const formattedLogs = auditLogs.map(log => ({
      id: log.id,
      actorId: log.actorId,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      detail: log.detail,
      createdAt: log.createdAt.toISOString(),
      actorName: log.actor?.name || 'System',
    }));

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error("Get audit logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}