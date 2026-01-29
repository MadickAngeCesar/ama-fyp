import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/stats/staff
 * Returns dashboard statistics for staff.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STAFF') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get complaint stats
    const [totalComplaints, pendingComplaints, inProgressComplaints, resolvedComplaints] = await Promise.all([
      db.complaint.count(),
      db.complaint.count({ where: { status: 'PENDING' } }),
      db.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      db.complaint.count({ where: { status: 'RESOLVED' } }),
    ]);

    // Get suggestion stats
    const [totalSuggestions, pendingSuggestions] = await Promise.all([
      db.suggestion.count(),
      db.suggestion.count({
        where: { status: 'PENDING' }
      }),
    ]);

    // Get active chat sessions
    const activeChats = await db.chatSession.count({
      where: { status: 'OPEN' }
    });

    // Get escalated chat sessions
    const escalatedChats = await db.chatSession.count({
      where: { escalated: true, status: 'OPEN' }
    });

    // Get recent pending complaints (last 3)
    const recentPendingComplaints = await db.complaint.findMany({
      where: { status: 'PENDING' },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    // Get recent pending suggestions (last 3)
    const recentPendingSuggestions = await db.suggestion.findMany({
      where: { status: 'PENDING' },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
        },
        _count: {
          select: { upvotes: true }
        }
      }
    });

    // Get recent active chat sessions (last 3)
    const recentActiveChats = await db.chatSession.findMany({
      where: { status: 'OPEN' },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
      },
      suggestions: {
        total: totalSuggestions,
        pending: pendingSuggestions,
      },
      chats: {
        active: activeChats,
        escalated: escalatedChats,
      },
      recentPendingComplaints: recentPendingComplaints.map(c => ({
        id: c.id,
        category: c.category,
        description: c.description,
        createdAt: c.createdAt.toISOString(),
        user: c.user
      })),
      recentPendingSuggestions: recentPendingSuggestions.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        upvotes: s._count.upvotes,
        createdAt: s.createdAt.toISOString(),
        user: s.user
      })),
      recentActiveChats: recentActiveChats.map(chat => ({
        id: chat.id,
        title: chat.title,
        lastActivity: chat.lastActivity.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get staff stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}