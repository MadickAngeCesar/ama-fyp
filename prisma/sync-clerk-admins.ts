import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClerkClient } from '@clerk/backend';
import type { User } from '@clerk/backend';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

/**
 * Synchronizes admin users from Clerk to the database.
 * Fetches all Clerk users with privateMetadata.role === 'ADMIN' and ensures they exist in the DB.
 * If a user exists in DB by email but lacks clerkId, links them.
 * If not in DB, creates a new DB user with role ADMIN.
 */
async function run() {
  const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const allAdmins: User[] = [];
  let offset = 0;
  const limit = 100; // Adjust limit as needed for pagination

  // Fetch all Clerk users with admin role via pagination
  while (true) {
    const users = await client.users.getUserList({ limit, offset });
    const admins = users.data.filter(u => u.privateMetadata?.role === 'ADMIN');
    allAdmins.push(...admins);
    if (users.data.length < limit) break;
    offset += limit;
  }

  console.log(`Found ${allAdmins.length} admin users in Clerk.`);

  // Sync each admin to DB
  for (const cUser of allAdmins) {
    const email = cUser.emailAddresses[0]?.emailAddress;
    if (!email) continue;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email,
          clerkId: cUser.id,
          name: cUser.firstName || '',
          role: 'ADMIN'
        }
      });
      console.log('Created DB user for', email);
    } else if (!existing.clerkId) {
      await prisma.user.update({ where: { id: existing.id }, data: { clerkId: cUser.id } });
      console.log('Linked clerkId for', email);
    }
  }

  await prisma.$disconnect();
}
run().catch(e=>{console.error(e);process.exit(1)});