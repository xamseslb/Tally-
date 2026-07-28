import { z } from 'zod';

export const APP_ROLES = [
  'worker',
  'supervisor',
  'engineer',
  'manager',
  'admin',
  'client',
] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const createUserSchema = z.object({
  fullName: z.string().min(2, 'Enter the full name'),
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .regex(/^[a-z0-9_.-]+$/i, 'Only letters, numbers, . _ -'),
  password: z.string().min(6, 'At least 6 characters'),
  role: z.enum(APP_ROLES),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;
