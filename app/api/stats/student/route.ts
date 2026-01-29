import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/stats/student
 * Returns dashboard statistics for students (their own data).
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get user's complaint stats
    const [totalComplaints, pendingComplaints, inProgressComplaints, resolvedComplaints] = await Promise.all([
      db.complaint.count({ where: { userId: user.id } }),
      db.complaint.count({ where: { userId: user.id, status: 'PENDING' } }),
      db.complaint.count({ where: { userId: user.id, status: 'IN_PROGRESS' } }),
      db.complaint.count({ where: { userId: user.id, status: 'RESOLVED' } }),
    ]);

    // Get user's suggestion stats
    const totalSuggestions = await db.suggestion.count({ where: { userId: user.id } });

    // Get user's active chat sessions
    const activeChats = await db.chatSession.count({
      where: {
        userId: user.id,
        status: 'OPEN'
      }
    });

    // Get recent complaints (last 3)
    const recentComplaints = await db.complaint.findMany({
      where: { userId: user.id },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    // Get recent suggestions (last 3)
    const recentSuggestions = await db.suggestion.findMany({
      where: { userId: user.id },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { upvotes: true }
        }
      }
    });

    // Get recent chat sessions (last 3)
    const recentChats = await db.chatSession.findMany({
      where: { userId: user.id },
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
      },
      activeChats,
      recentComplaints: recentComplaints.map(c => ({
        id: c.id,
        category: c.category,
        description: c.description,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
      recentSuggestions: recentSuggestions.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        upvotes: s._count.upvotes,
        createdAt: s.createdAt.toISOString(),
      })),
      recentChats: recentChats.map(chat => ({
        id: chat.id,
        title: chat.title,
        status: chat.status,
        lastActivity: chat.lastActivity.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get student stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}