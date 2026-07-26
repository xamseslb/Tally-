<!-- Sjekkliste fra spec §9. PR selv når du jobber alene — det er der du leser
     din egen kode med fremmede øyne. -->

## Hva og hvorfor

<!-- Kort: hvilken del av byggeplanen, hva endringen gjør. -->

## Sjekkliste

- [ ] Tester lagt til i samme PR som koden
- [ ] `npm run typecheck`, `npm run lint`, `npm test` kjørt og grønne
- [ ] Spec (`docs/SPEC.md`) oppdatert hvis krav endret seg
- [ ] Ingen hemmeligheter i klientkode (`service_role` kun i Edge Functions)
- [ ] Tilgjengelighet sjekket (treffområde 48 pt, labels, kontrast)
- [ ] Offline testet der det er relevant (flymodus, tapt nett)
- [ ] Ny ADR i `docs/ADR/` ved arkitekturvalg
