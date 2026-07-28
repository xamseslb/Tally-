import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Field, Text, colors, radius, spacing } from '@/ui';

import { createUser } from '../api/team-api';
import { APP_ROLES, type AppRole, createUserSchema, type CreateUserInput } from '../model/schemas';

export function CreateUserForm({ onCreated }: { onCreated: () => void }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { fullName: '', username: '', password: '', role: 'worker' },
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [role, setRole] = useState<AppRole>('worker');

  const selectRole = (r: AppRole) => {
    setRole(r);
    setValue('role', r, { shouldValidate: true });
  };

  const onSubmit = async (input: CreateUserInput): Promise<void> => {
    setFormError(null);
    const result = await createUser(input);
    if (result.ok) onCreated();
    else setFormError(result.error);
  };

  const field = (name: 'fullName' | 'username' | 'password', label: string, secure = false) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Field
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors[name]?.message}
          autoCapitalize={name === 'fullName' ? 'words' : 'none'}
          autoCorrect={false}
          secureTextEntry={secure}
        />
      )}
    />
  );

  return (
    <View style={{ gap: spacing.lg }}>
      {field('fullName', t('team.fullName'))}
      {field('username', t('team.username'))}
      {field('password', t('team.password'), true)}

      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="slate">
          {t('team.role')}
        </Text>
        <View style={styles.chips}>
          {APP_ROLES.map((r) => {
            const sel = r === role;
            return (
              <Pressable
                key={r}
                accessibilityRole="radio"
                accessibilityState={{ selected: sel }}
                onPress={() => selectRole(r)}
                style={[styles.chip, sel && styles.chipSel]}
              >
                <Text variant="label" style={{ color: sel ? colors.onBrand : colors.ink }}>
                  {t(`roles.${r}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {formError ? (
        <Text variant="small" color="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}
      <Button
        label={t('team.create')}
        loading={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipSel: { backgroundColor: colors.brand, borderColor: colors.brand },
});
