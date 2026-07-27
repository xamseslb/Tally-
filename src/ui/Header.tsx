import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { spacing } from './tokens';

export interface HeaderProps {
  title: string;
  right?: ReactNode;
}

/** Skjerm-header: stor tittel + valgfri handling til høyre (mockup). */
export function Header({ title, right }: HeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="display">{title}</Text>
      {right ?? null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: spacing.xxxl,
  },
});
