import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { StatusStripe, type SyncState } from './StatusStripe';
import { colors, spacing } from './tokens';

export interface ScreenProps {
  children: ReactNode;
  /** Synkstripen ligger alltid øverst (spec §7). */
  syncState?: SyncState;
  pendingCount?: number;
  edges?: readonly Edge[];
}

/** Standard skjermramme: synkstripe øverst, trygt område, rolig bakgrunn. */
export function Screen({
  children,
  syncState = 'synced',
  pendingCount,
  edges = ['top', 'left', 'right', 'bottom'],
}: ScreenProps) {
  return (
    <View style={styles.root}>
      <StatusStripe state={syncState} pendingCount={pendingCount} />
      <SafeAreaView style={styles.safe} edges={edges}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  safe: { flex: 1 },
  content: { flex: 1, padding: spacing.lg, gap: spacing.md },
});
