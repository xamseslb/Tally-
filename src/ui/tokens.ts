/**
 * Design-tokens. Eneste kilde til farge, spacing, radius og typografi.
 * Komponenter importerer HERFRA — aldri hardkodet hex eller pikselverdier.
 *
 * Palett etterligner kundens mockup (grønt, kort, statusmerker) og overstyrer
 * det opprinnelige gule uttrykket i spec §7 — se docs/ADR/0003.
 */
import { Platform } from 'react-native';

export const colors = {
  // Tekst og flater
  ink: '#14181B', // primærtekst, nær-svart
  slate: '#66727A', // sekundærtekst
  line: '#E4E7E8', // kantlinjer, delelinjer
  surface: '#FFFFFF', // kort
  paper: '#F4F5F5', // bakgrunn

  // Merkevare (primærhandling)
  brand: '#1B7A4B', // grønn — knapper, aktiv fane
  brandDark: '#145F3A',
  brandSoft: '#E4F2EA', // lys grønn bakgrunn (merker, fyll)
  onBrand: '#FFFFFF',

  // Status
  success: '#1B7A4B', // signert / OK
  info: '#2563EB', // levert
  infoSoft: '#E4ECFB',
  warning: '#B7791F', // utkast / advarsel
  warningSoft: '#FBEFD6',
  alert: '#C8321E', // feil, HMS-avvik
  alertSoft: '#F8E1DD',
  onAlert: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;

/** 4-punkts spacing-skala. Bruk navn, aldri løse tall. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** Tilgjengelighetskrav (spec §4): hansker og solskinn. Ikke senk disse. */
export const a11y = {
  minTouchTarget: 48,
  minBodyFontSize: 15,
} as const;

export const fontFamily = {
  display: undefined as string | undefined,
  body: undefined as string | undefined,
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
} as const;

export const fontSize = {
  display: 28,
  title: 20,
  heading: 17,
  body: 16,
  label: 14,
  small: 12,
} as const;

export const lineHeight = {
  display: 34,
  title: 26,
  heading: 24,
  body: 22,
  label: 18,
  small: 16,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/** Myk skygge for kort (iOS-aktig). */
export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;
