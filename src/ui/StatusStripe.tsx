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
 * Synkstripen (spec §7): 4 pt stripe i toppen, alltid synlig. Svarer på det
 * reelle spørsmålet i en offline-app — «kom dataene mine frem?» — uten modal.
 *
 * Dette er primitiv-versjonen. Sperrebånd-animasjon og trykkbar synklogg
 * bygges ut i Fase 6 (offline-herding).
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
  synced: colors.hivis,
  pending: colors.signal,
  error: colors.alert,
};

const LABELS: Record<SyncState, (count: number) => string> = {
  synced: () => 'Alt er synkronisert',
  pending: (count) => `${count} element${count === 1 ? '' : 'er'} venter på nett`,
  error: () => 'Synkfeil. Trykk for å se detaljer',
};

const styles = StyleSheet.create({
  stripe: { height: 4, width: '100%' },
});
