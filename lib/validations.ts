import { z } from 'zod';

/**
 * Schema for creating a new user.
 */
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['STUDENT', 'STAFF', 'ADMIN']),
});