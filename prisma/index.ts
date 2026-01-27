import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Tests the database connection using Prisma Client.
 * Attempts to connect to the database and logs the result.
 */
async function testConnection(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the connection test
testConnection();
