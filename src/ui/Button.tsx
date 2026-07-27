import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { a11y, colors, radius, spacing } from './tokens';

type Variant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
}

/**
 * Primærknapp. Knappetekst = handlingen som skjer (spec §7): «Levér rapport».
 * Full bredde, grønn merkevarefarge (mockup). Minste treffområde 48 pt.
 */
export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={palette.fg} />
        ) : (
          <Text variant="heading" style={{ color: palette.fg, fontWeight: '600' }}>
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.brand, fg: colors.onBrand, border: colors.brand },
  secondary: { bg: colors.surface, fg: colors.ink, border: colors.line },
  danger: { bg: colors.surface, fg: colors.alert, border: colors.alert },
};

const styles = StyleSheet.create({
  base: {
    minHeight: a11y.minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
});
