/**
 * Design-tokens (spec §7). Eneste kilde til farge, spacing, radius og typografi.
 * Komponenter importerer HERFRA — aldri hardkodet hex eller pikselverdier.
 */
import { Platform } from 'react-native';

export const colors = {
  ink: '#0F1417', // tekst, mørk flate
  slate: '#38444B', // sekundærtekst, kantlinjer
  concrete: '#E8EAE9', // flater, kort
  paper: '#F7F8F7', // bakgrunn
  signal: '#FFB627', // primærhandling, "krever handling"
  hivis: '#B4E000', // synket / OK — brukes sparsomt
  alert: '#C8321E', // feil, HMS-avvik
  onSignal: '#0F1417', // tekst oppå signal-gul
  onAlert: '#FFFFFF', // tekst oppå alert-rød
} as const;

export type ColorToken = keyof typeof colors;

/** 4-punkts spacing-skala. Bruk navn, aldri løse tall. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

/**
 * Minste treffområde og brødtekststørrelse er tilgjengelighetskrav (spec §4):
 * hansker og solskinn på skjerm. Ikke senk disse.
 */
export const a11y = {
  minTouchTarget: 48,
  minBodyFontSize: 17,
} as const;

/**
 * Fontfamilier. Egne fontfiler (Archivo Condensed, Inter, IBM Plex Mono)
 * lastes inn i en senere del av Fase 0; inntil da faller display/body tilbake
 * til systemfont, og mono bruker plattformens monospace slik at logg-preget
 * (rapport-ID, klokkeslett, synkstatus) allerede er på plass.
 */
export const fontFamily = {
  display: undefined as string | undefined, // TODO: 'ArchivoCondensed'
  body: undefined as string | undefined, // TODO: 'Inter'
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
} as const;

export const fontSize = {
  display: 32,
  title: 22,
  body: 17,
  label: 15,
  small: 13,
} as const;

export const lineHeight = {
  display: 36,
  title: 28,
  body: 24,
  label: 20,
  small: 18,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  bold: '700',
} as const;
