import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from './db';

/**
 * Gets the current authenticated user from the database using Clerk's user ID.
 * If not found by clerkId, checks by email and links if found.
 * @returns The user object if found and linked, null otherwise.
 */
export async function getCurrentUser() {
  const authResult = await auth();
  const { userId } = authResult;
  if (!userId) return null;

  // Protect against DB connectivity errors (e.g. Supabase down/credentials invalid).
  let user = null;
  try {
    user = await db.user.findUnique({ where: { clerkId: userId } });
  } catch (dbError) {
    // Log and return null to avoid crashing during auth flow.
    console.error('Database error when fetching user by clerkId:', dbError);
    return null;
  }

  if (user) return user;

  // Not found by clerkId, check by email for new sign-ups
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (email) {
      const userByEmail = await db.user.findUnique({
        where: { email },
      });
      if (userByEmail && !userByEmail.clerkId) {
        // Link the user
        user = await db.user.update({
          where: { id: userByEmail.id },
          data: { clerkId: userId },
        });
        return user;
      }
    }
  } catch (error) {
    console.error('Error fetching user from Clerk:', error);
  }

  return null;
}

/**
 * Gets the redirect URL based on the user's role.
 * @param role The user's role.
 * @returns The appropriate dashboard URL.
 */
export function getRedirectUrl(role: string): string {
  switch (role) {
    case 'STUDENT':
      return '/students';
    case 'STAFF':
      return '/staff';
    case 'ADMIN':
      return '/admin';
    default:
      return '/';
  }
}