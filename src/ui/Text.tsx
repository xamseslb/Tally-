import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

import { colors, type ColorToken, fontFamily, fontSize, fontWeight, lineHeight } from './tokens';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'mono' | 'small';

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: ColorToken;
}

/** Typet tekst-primitiv. All tekst i appen går gjennom denne (spec §7). */
export function Text({ variant = 'body', color = 'ink', style, ...rest }: AppTextProps) {
  return <RNText style={[styles[variant], { color: colors[color] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    fontWeight: fontWeight.bold,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.title,
    lineHeight: lineHeight.title,
    fontWeight: fontWeight.bold,
  },
  heading: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.heading,
    lineHeight: lineHeight.heading,
    fontWeight: fontWeight.semibold,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.label,
    lineHeight: lineHeight.label,
    fontWeight: fontWeight.medium,
  },
  small: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    lineHeight: lineHeight.small,
    fontWeight: fontWeight.regular,
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.label,
    lineHeight: lineHeight.label,
  },
});
