import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, shadow, spacing } from './tokens';

export interface CardProps extends ViewProps {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/** Hvitt kort med myk skygge (mockup). Trykkbart hvis onPress er satt. */
export function Card({ children, onPress, accessibilityLabel, style, ...rest }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  pressed: { opacity: 0.9 },
});
