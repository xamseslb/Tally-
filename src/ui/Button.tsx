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
 * Minste treffområde 48 pt (spec §4). accessibilityLabel settes fra label.
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
          <Text variant="label" style={{ color: palette.fg }}>
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.signal, fg: colors.onSignal, border: colors.signal },
  secondary: { bg: colors.paper, fg: colors.ink, border: colors.slate },
  danger: { bg: colors.alert, fg: colors.onAlert, border: colors.alert },
};

const styles = StyleSheet.create({
  base: {
    minHeight: a11y.minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
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
