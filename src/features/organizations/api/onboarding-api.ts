import { z } from 'zod';

import { err, ok, type Result } from '@/lib/result';
import { supabase } from '@/lib/supabase';

const MembershipSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  role: z.string(),
});
export type Membership = z.infer<typeof MembershipSchema>;

/** Henter brukerens aktive medlemskap (null hvis ingen → må gjennom onboarding). */
export async function fetchActiveMembership(userId: string): Promise<Result<Membership | null>> {
  const { data, error } = await supabase
    .from('memberships')
    .select('id, organization_id, role')
    .eq('user_id', userId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) return err('Kunne ikke hente medlemskap. Prøv igjen når du har dekning.');
  if (!data) return ok(null);

  const parsed = MembershipSchema.safeParse(data);
  return parsed.success ? ok(parsed.data) : err('Uventet svar fra server.');
}

/** Oppretter organisasjon + admin-medlemskap atomisk via RPC. Returnerer org-id. */
export async function createOrganization(name: string, fullName?: string): Promise<Result<string>> {
  const { data, error } = await supabase.rpc('onboard_organization', {
    org_name: name,
    full_name: fullName ?? null,
  });

  if (error) return err('Kunne ikke opprette organisasjon. Prøv igjen.');

  const parsed = z.string().safeParse(data);
  return parsed.success ? ok(parsed.data) : err('Uventet svar fra server.');
}
