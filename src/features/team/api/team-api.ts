import { z } from 'zod';

import { err, ok, type Result } from '@/lib/result';
import { supabase } from '@/lib/supabase';

import type { CreateUserInput } from '../model/schemas';

const MemberSchema = z.object({
  user_id: z.string(),
  role: z.string(),
  is_active: z.boolean(),
  profiles: z.object({ full_name: z.string(), username: z.string().nullable() }).nullable(),
});
export type Member = z.infer<typeof MemberSchema>;

export async function listMembers(): Promise<Result<Member[]>> {
  const { data, error } = await supabase
    .from('memberships')
    .select('user_id, role, is_active, profiles(full_name, username)')
    .order('role', { ascending: true });

  if (error) return err('Could not load the team.');
  const parsed = z.array(MemberSchema).safeParse(data ?? []);
  return parsed.success ? ok(parsed.data) : err('Unexpected response from server.');
}

export async function createUser(input: CreateUserInput): Promise<Result<string>> {
  const { data, error } = await supabase.rpc('admin_create_user', {
    p_full_name: input.fullName,
    p_username: input.username,
    p_password: input.password,
    p_role: input.role,
  });

  if (error) return err(error.message || 'Could not create the user. Try again.');
  const parsed = z.string().safeParse(data);
  return parsed.success ? ok(parsed.data) : err('Unexpected response from server.');
}
