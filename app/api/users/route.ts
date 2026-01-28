import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { createUserSchema } from '@/lib/validations';
import { createClerkClient } from '@clerk/backend';
import { randomBytes } from 'crypto';

/**
 * GET /api/users - Lists all users (admin only).
 * @returns JSON array of users or error response.
 */
export async function GET() {
  const authResult = await auth();
  const { userId } = authResult;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let currentUser;
  try {
    currentUser = await db.user.findUnique({ where: { clerkId: userId } });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'STAFF')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let users;
  try {
    users = await db.user.findMany({
      where: {
        role: { in: ['STAFF', 'ADMIN', 'STUDENT'] }
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  return NextResponse.json(users);
}

/**
 * POST /api/users - Creates a new user (admin only).
 * @param request The request containing user data.
 * @returns JSON of created user or error response.
 */
export async function POST(request: NextRequest) {
  const authResult = await auth();
  const { userId } = authResult;
  console.log('userId:', userId);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let currentUser;
  try {
    currentUser = await db.user.findUnique({ where: { clerkId: userId } });
    console.log('currentUser:', currentUser);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error }, { status: 400 });
  }

  const { name, email, role } = parsed.data;

  // Check if email already exists
  let existing;
  try {
    existing = await db.user.findUnique({ where: { email } });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  if (existing) {
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
  }

  // Check if CLERK_SECRET_KEY is set
  if (!process.env.CLERK_SECRET_KEY) {
    return NextResponse.json({ error: 'CLERK_SECRET_KEY environment variable not set' }, { status: 500 });
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  // Get admin's organization
  let adminOrgId = null;
  try {
    const membershipsRes = await fetch(`https://api.clerk.com/v1/users/${userId}/organization_memberships`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    if (membershipsRes.ok) {
      const memberships = await membershipsRes.json();
      if (memberships.length > 0) {
        adminOrgId = memberships[0].organization_id;
      }
    }
  } catch (error) {
    console.error('Failed to get admin organization:', error);
  }

  // Create user in Clerk
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  let clerkUser;
  try {
    clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      privateMetadata: { role },
    });
  } catch (errorUnknown) {
    const err = errorUnknown as { message?: string; status?: number; clerkError?: boolean; errors?: unknown };

    // If user already exists, try to find them and update metadata
    if (err.message?.includes('already exists') || err.status === 409) {
      try {
        const existingUsers = await clerk.users.getUserList({ emailAddress: [email] });
        if (existingUsers.data.length > 0) {
          clerkUser = existingUsers.data[0];
          await clerk.users.updateUser(clerkUser.id, { privateMetadata: { role } });
        } else {
          throw errorUnknown;
        }
      } catch (getError) {
        return NextResponse.json({ error: 'Failed to create or find user in Clerk', details: getError }, { status: 500 });
      }

    // If Clerk rejects due to missing password or other validation (422), retry with a generated password
    } else if (err.status === 422) {
      try {
        const pwd = randomBytes(24).toString('hex');
        clerkUser = await clerk.users.createUser({
          emailAddress: [email],
          firstName,
          lastName,
          password: pwd,
          privateMetadata: { role },
        });
      } catch (retryError) {
        // As a last resort try to find an existing user
        try {
          const existingUsers = await clerk.users.getUserList({ emailAddress: [email] });
          if (existingUsers.data.length > 0) {
            clerkUser = existingUsers.data[0];
            await clerk.users.updateUser(clerkUser.id, { privateMetadata: { role } });
          } else {
            return NextResponse.json({ error: 'Failed to create user in Clerk', details: retryError }, { status: 500 });
          }
        } catch (getError) {
          return NextResponse.json({ error: 'Failed to create or find user in Clerk', details: getError }, { status: 500 });
        }
      }

    } else {
      return NextResponse.json({ error: 'Failed to create user in Clerk', details: errorUnknown }, { status: 500 });
    }
  }

  const clerkId = clerkUser.id;

  // Add to organization if admin has one
  if (adminOrgId) {
    try {
      await fetch(`https://api.clerk.com/v1/organizations/${adminOrgId}/memberships`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: clerkId,
          role: role === 'ADMIN' ? 'admin' : 'member',
        }),
      });
    } catch (error) {
      console.error('Failed to add user to organization:', error);
    }
  }

  // Create invitation in Clerk
  try {
    await clerk.invitations.createInvitation({
      emailAddress: email,
    });
  } catch (error) {
    // If invitation fails, still proceed but log
    console.error('Failed to create invitation for user:', email, error);
  }

  // Create user in database
  let newUser;
  try {
    newUser = await db.user.create({
      data: {
        name,
        email,
        role,
        clerkId,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user in database', details: error }, { status: 500 });
  }

  return NextResponse.json(newUser, { status: 201 });
}