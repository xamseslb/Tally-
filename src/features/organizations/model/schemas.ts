import { z } from 'zod';

/** Skjema for å opprette organisasjon under onboarding. */
export const createOrgSchema = z.object({
  name: z.string().min(2, 'Skriv inn navn på organisasjonen'),
});
export type CreateOrgInput = z.infer<typeof createOrgSchema>;
