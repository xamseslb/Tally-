import { useAuthStore } from '../model/auth-store';

/** Praktisk lesehook for auth-tilstand. */
export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const session = useAuthStore((s) => s.session);
  return { status, session, userId: session?.user.id ?? null };
}
