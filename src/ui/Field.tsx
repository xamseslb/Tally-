import { useId } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { Text } from './Text';
import { a11y, colors, fontSize, radius, spacing } from './tokens';

export interface FieldProps extends TextInputProps {
  label: string;
  /** Feiltekst sier hva som skjedde og hva brukeren kan gjøre (spec §7). */
  error?: string;
}

/** Skjemafelt med label, input og feiltekst. Alt bundet sammen for VoiceOver. */
export function Field({ label, error, style, ...rest }: FieldProps) {
  const id = useId();
  return (
    <View style={styles.wrap}>
      <Text variant="label" color="slate" nativeID={`${id}-label`}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityLabelledBy={`${id}-label`}
        placeholderTextColor={colors.slate}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? (
        <Text variant="small" color="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  input: {
    minHeight: a11y.minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate,
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.body,
    color: colors.ink,
  },
  inputError: { borderColor: colors.alert },
});
