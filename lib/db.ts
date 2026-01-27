import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });

/**
 * Prisma database client instance.
 */
export const db = new PrismaClient({ adapter });