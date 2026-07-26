import { supabase } from '@/lib/supabase';
import { err, ok, type Result } from '@/lib/result';

import { mapAuthError } from './auth-errors';
import type { MagicLinkInput, SignInInput, SignUpInput } from '../model/schemas';

/** E-post + passord. */
export async function signInWithPassword(input: SignInInput): Promise<Result<void>> {
  const { error } = await supabase.auth.signInWithPassword(input);
  return error ? err(mapAuthError(error.message)) : ok(undefined);
}

/** Registrering. Fullt navn lagres i user-metadata og speiles til profiles ved onboarding. */
export async function signUpWithPassword(input: SignUpInput): Promise<Result<void>> {
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.fullName } },
  });
  return error ? err(mapAuthError(error.message)) : ok(undefined);
}

/** Magic link som fallback (spec §3 FR-1). */
export async function sendMagicLink(input: MagicLinkInput): Promise<Result<void>> {
  const { error } = await supabase.auth.signInWithOtp({ email: input.email });
  return error ? err(mapAuthError(error.message)) : ok(undefined);
}

export async function signOut(): Promise<Result<void>> {
  const { error } = await supabase.auth.signOut();
  return error ? err(mapAuthError(error.message)) : ok(undefined);
}
