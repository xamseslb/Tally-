# ADR 0002 — Multi-tenant SaaS fra dag én

**Status:** Vedtatt · **Dato:** 2026-07-25

## Kontekst

Appen skal i offentlig App Store (spec §0). To gjensidig utelukkende veier:
multi-tenant SaaS (A) eller intern app for én bedrift (B).

## Beslutning

**Vei A — multi-tenant.** Alle tabeller bærer `organization_id` fra første
migrasjon. Egenregistrering og flere organisasjoner støttes.

## Begrunnelse

- `organization_id` koster nesten ingenting å ta med fra start og er nesten
  umulig å ettermontere.
- Apple avviser ofte rene internverktøy på offentlig App Store etter
  retningslinje 4.2 (for smal nytte). Multi-tenant + egenregistrering unngår det.
- Rollemodellen håndheves som `rolle ∩ prosjektmedlemskap` i RLS, som forutsetter
  `organization_id` overalt.

## Konsekvenser

Selv med kun én kunde nå, bygges appen som et produkt. RLS-policies filtrerer
alltid på organisasjon. Se `supabase/migrations/0002_rls.sql`.
