import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from './tokens';

export interface ScreenProps {
  children: ReactNode;
  /** Rull innhold vertikalt (lister, lange skjemaer). */
  scroll?: boolean;
  edges?: readonly Edge[];
}

/** Standard skjermramme: trygt område, rolig grå bakgrunn (mockup). */
export function Screen({
  children,
  scroll = false,
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={edges}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, styles.content]}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
});
