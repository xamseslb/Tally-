import { type ErrorBoundaryProps } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { Text } from './Text';
import { colors, spacing } from './tokens';

/**
 * Error boundary på rutenivå (spec §4: appen skal aldri vise hvit skjerm).
 * Eksporteres som `ErrorBoundary` fra layout-ruter slik expo-router forventer.
 */
export function RouteError({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Text variant="title">Noe stoppet opp</Text>
      <Text variant="body" color="slate" style={styles.detail}>
        {error.message}
      </Text>
      <Button label="Prøv igjen" onPress={retry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.paper,
  },
  detail: { textAlign: 'center' },
});
