import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

/**
 * Schema for updating user role.
 */
const updateRoleSchema = z.object({
  role: z.enum(['STUDENT', 'STAFF', 'ADMIN']),
});

/**
 * PUT /api/users/[id]/role - Updates a user's role (admin only).
 * @param request The request containing the new role.
 * @param params The route parameters containing the user ID.
 * @returns JSON of updated user or error response.
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const body = await request.json();
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error }, { status: 400 });
  }

  const { role } = parsed.data;

  const userToUpdate = await db.user.findUnique({ where: { id } });
  if (!userToUpdate) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: { role },
  });

  return NextResponse.json(updatedUser);
}