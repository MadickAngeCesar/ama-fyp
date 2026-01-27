import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

/**
 * DELETE /api/users/[id] - Deletes a user (admin only).
 * @param request The request.
 * @param params The route parameters containing the user ID.
 * @returns JSON success response or error.
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authResult = await auth();
  const { userId } = authResult;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = await db.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const userToDelete = await db.user.findUnique({ where: { id } });
  if (!userToDelete) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Prevent deleting self
  if (userToDelete.id === currentUser.id) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  await db.user.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}