import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { createUserSchema } from '@/lib/validations';

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

  const currentUser = await db.user.findUnique({ where: { clerkId: userId } });
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
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
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = await db.user.findUnique({ where: { clerkId: userId } });
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
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
  }

  const newUser = await db.user.create({
    data: {
      name,
      email,
      role,
      clerkId: '', // Will be set on first sign-in
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}