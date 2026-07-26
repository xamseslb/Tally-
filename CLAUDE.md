# CLAUDE.md — Dagsverk

Les `docs/SPEC.md` før du skriver kode. Spec-en vinner over antakelser. Er noe uklart i spec-en, spør — ikke gjett og bygg videre.

## Hva dette er

React Native (Expo) feltdokumentasjonsapp for byggeplasser. Offline-first. Skal i App Store. Vedlikeholdes av én utvikler — derfor er lesbarhet viktigere enn smarthet overalt.

## Ufravikelige regler

1. **Ingen kode uten plan.** Legg fram en kort plan og vent på godkjenning før du skriver filer. Gjelder også små endringer som berører synk, RLS eller rapport-tilstandsmaskinen.
2. **Tester i samme leveranse som koden.** En feature uten test er ikke ferdig.
3. **TypeScript `strict`. `any` er forbudt.** Bruk `unknown` + zod-validering.
4. **Rettigheter håndheves i databasen.** Legg aldri til en RLS-policy uten en pgTAP-test som beviser at den nekter det den skal nekte.
5. **Signerte rapporter er uforanderlige.** Foreslå aldri en løsning som endrer en `signed` rapport. Rettelser er revisjoner med `supersedes_id`.
6. **Alt skriving går til lokal SQLite først.** UI bekrefter aldri noe som bare finnes i minnet eller på nettet.
7. **Ingen hemmeligheter i klientkode.** `service_role`-nøkkel kun i Edge Functions. Tokens i `expo-secure-store`, aldri AsyncStorage.
8. **Serverklokka er autoritativ.** Bruk aldri enhetens tid til tidsstempler som betyr noe (signatur, synk, audit).
9. **Migrasjoner er uforanderlige etter merge.** Rett feil med ny migrasjon.
10. **Ikke legg til avhengigheter uten å spørre.** Hver pakke er noe jeg må vedlikeholde.

## Struktur

- Organiser etter feature (`src/features/reports/`), ikke etter filtype.
- `src/features/x` importerer aldri fra `src/features/y`. Delt kode → `src/lib` eller `src/ui`.
- Avhengighetsretning: `app/` → `features/` → `ui/`, `lib/` → `db/`. Aldri motsatt.
- Maks 300 linjer per fil, 50 per funksjon. Er du over, er abstraksjonen feil.
- Ingen toppnivåmapper som heter `utils`, `helpers` eller `misc`.

## UI

- Bruk kun tokens fra `src/ui/tokens.ts`. Aldri hardkodet hex, aldri hardkodede pikselverdier for spacing.
- Minste treffområde 48×48 pt. Brødtekst minimum 17 pt. Alle interaktive elementer har `accessibilityLabel`.
- Virtualiserte lister alltid (`FlashList`/`FlatList`). Aldri `.map()` over et datasett som kan vokse.
- Norsk tekst går gjennom i18n-nøkler, aldri direkte i komponenten.
- Knappetekst = handlingen som skjer. Samme ord gjennom hele flyten («Signér» → «Signert»).
- Feilmeldinger sier hva som skjedde og hva brukeren kan gjøre. Aldri «Noe gikk galt».

## Feil og nettverk

- Ingen naken `await`. Hvert asynkront kall har eksplisitt feilhåndtering.
- Nettverk: timeout 15 s, eksponentiell backoff med jitter, maks 5 forsøk.
- Error boundary på hver rute. Hvit skjerm er en bug.
- `console.log` er forbudt utenfor tester. Bruk logger med nivå.

## Git

- Conventional Commits: `feat(reports): ...`, `fix(sync): ...`, `test(rls): ...`.
- En branch per fase i byggeplanen. PR selv når jeg jobber alene.
- Nytt arkitekturvalg → ny fil i `docs/ADR/`, nummerert, med alternativene som ble forkastet.

## Kommandoer

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # eslint + prettier
npm test               # jest
npm run test:rls       # pgTAP mot lokal supabase
npm run e2e            # maestro
npx supabase db reset  # kjør alle migrasjoner på nytt lokalt
```

Kjør `typecheck`, `lint` og `test` før du sier at noe er ferdig. Ikke rapporter suksess på noe du ikke har kjørt.

## Hvordan jeg vil at du jobber

- Én fase av byggeplanen per samtale.
- Vis diff-er som er små nok til at jeg kan lese dem. Store leveranser blir ikke lest, og kode jeg ikke har lest kan jeg ikke vedlikeholde.
- Si det tydelig når du er usikker, i stedet for å skrive selvsikker kode.
- Er en instruks i denne filen feil eller i veien, si det — ikke omgå den stille.
