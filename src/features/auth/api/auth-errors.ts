/**
 * Oversetter Supabase Auth-feil til norske, handlingsrettede meldinger.
 * Aldri «Noe gikk galt» (spec §7).
 */
const MESSAGES: { match: string; message: string }[] = [
  { match: 'invalid login credentials', message: 'Feil e-post eller passord. Prøv igjen.' },
  { match: 'email not confirmed', message: 'Bekreft e-posten din før du logger inn.' },
  {
    match: 'user already registered',
    message: 'Denne e-posten er allerede registrert. Logg inn i stedet.',
  },
  { match: 'rate limit', message: 'For mange forsøk. Vent litt og prøv igjen.' },
  { match: 'network', message: 'Ingen nettforbindelse. Prøv igjen når du har dekning.' },
];

export function mapAuthError(raw: string): string {
  const lower = raw.toLowerCase();
  const hit = MESSAGES.find((m) => lower.includes(m.match));
  return hit ? hit.message : 'Innlogging feilet. Sjekk nettforbindelsen og prøv igjen.';
}
