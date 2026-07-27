import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from './tokens';

export type SyncState = 'synced' | 'pending' | 'error';

export interface StatusStripeProps {
  state: SyncState;
  /** Antall elementer som venter på synk. Vises i accessibilityLabel. */
  pendingCount?: number;
  onPress?: () => void;
}

/**
 * Synkstripen (spec §7): tynn stripe som viser synkstatus. Brukes nå kun der
 * det er relevant (offline-banner bygges i Fase 6). Grønn = synket.
 */
export function StatusStripe({ state, pendingCount = 0, onPress }: StatusStripeProps) {
  const label = LABELS[state](pendingCount);
  const stripe = (
    <View
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={label}
      style={[styles.stripe, { backgroundColor: STATE_COLOR[state] }]}
    />
  );

  if (state === 'error' && onPress) {
    return (
      <Pressable accessibilityLabel={label} onPress={onPress}>
        {stripe}
      </Pressable>
    );
  }
  return stripe;
}

const STATE_COLOR: Record<SyncState, string> = {
  synced: colors.success,
  pending: colors.warning,
  error: colors.alert,
};

const LABELS: Record<SyncState, (count: number) => string> = {
  synced: () => 'Alt er synkronisert',
  pending: (count) => `${count} element${count === 1 ? '' : 'er'} venter på nett`,
  error: () => 'Synkfeil. Trykk for å se detaljer',
};

const styles = StyleSheet.create({
  stripe: { height: 3, width: '100%' },
});
