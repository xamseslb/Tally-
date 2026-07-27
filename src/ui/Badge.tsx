import { StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { colors, radius, spacing } from './tokens';

export type BadgeTone = 'success' | 'info' | 'warning' | 'neutral';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

/** Statusmerke (pill), f.eks. Signert / Levert / Utkast / Aktiv (mockup). */
export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const palette = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text variant="small" style={{ color: palette.fg, fontWeight: '600' }}>
        {label}
      </Text>
    </View>
  );
}

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  success: { bg: colors.brandSoft, fg: colors.success },
  info: { bg: colors.infoSoft, fg: colors.info },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  neutral: { bg: colors.paper, fg: colors.slate },
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
