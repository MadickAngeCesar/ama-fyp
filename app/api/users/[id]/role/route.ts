import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createClerkClient } from '@clerk/backend';

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

  // Update Clerk user's private metadata
  if (updatedUser.clerkId) {
    try {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      await clerk.users.updateUser(updatedUser.clerkId, {
        privateMetadata: { role },
      });

      // Update organization membership role if applicable
      const membershipsRes = await fetch(`https://api.clerk.com/v1/users/${updatedUser.clerkId}/organization_memberships`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });
      if (membershipsRes.ok) {
        const memberships = await membershipsRes.json();
        if (memberships.length > 0) {
          const membership = memberships[0];
          const newOrgRole = role === 'ADMIN' ? 'admin' : 'member';
          if (membership.role !== newOrgRole) {
            await fetch(`https://api.clerk.com/v1/organizations/${membership.organization_id}/memberships/${membership.id}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ role: newOrgRole }),
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to update user in Clerk:', error);
    }
  }

  return NextResponse.json(updatedUser);
}