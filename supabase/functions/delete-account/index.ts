// Edge Function: kontosletting (Apple 5.1.1(v)). Deno-runtime.
// service_role-nøkkel finnes KUN her (CLAUDE.md #7), aldri i klienten.
//
// Personvern (spec §): rapporter er dokumentasjon med mulig oppbevaringsplikt.
// Vi sletter derfor IKKE rapportene — vi anonymiserer forfatteren og deaktiverer
// medlemskap, og sletter selve auth-brukeren så innlogging ikke lenger er mulig.
//
// NB: ikke deployet enda. Deploy med `supabase functions deploy delete-account`
// når CLI er logget inn.
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Mangler autorisasjon' }, 401);

    const url = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !anonKey || !serviceKey) return json({ error: 'Mangler serverkonfig' }, 500);

    // Identifiser innsenderen fra deres egen JWT.
    const caller = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userErr,
    } = await caller.auth.getUser();
    if (userErr || !user) return json({ error: 'Ugyldig sesjon' }, 401);

    // Anonymiser + deaktiver + slett — med service_role.
    const admin = createClient(url, serviceKey);
    await admin
      .from('profiles')
      .update({ full_name: 'Slettet bruker', phone: null, avatar_path: null })
      .eq('id', user.id);
    await admin.from('memberships').update({ is_active: false }).eq('user_id', user.id);

    const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
    if (delErr) return json({ error: delErr.message }, 500);

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
