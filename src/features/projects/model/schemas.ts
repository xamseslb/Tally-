import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Skriv inn prosjektnavn'),
  projectNumber: z.string().optional(),
  address: z.string().optional(),
  clientName: z.string().optional(),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const PROJECT_STATUSES = ['active', 'paused', 'completed', 'archived'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
