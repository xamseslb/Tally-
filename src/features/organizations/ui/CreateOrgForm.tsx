import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useAuth } from '@/features/auth';
import { Button, Field, Text, spacing } from '@/ui';

import { createOrganization } from '../api/onboarding-api';
import { useMembershipStore } from '../model/membership-store';
import { createOrgSchema, type CreateOrgInput } from '../model/schemas';

/** Oppretter organisasjon. Når medlemskapet oppdateres, ruter gaten til appen. */
export function CreateOrgForm() {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const refresh = useMembershipStore((s) => s.refresh);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrgInput>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { name: '' },
  });
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (input: CreateOrgInput): Promise<void> => {
    setFormError(null);
    const result = await createOrganization(input.name);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    if (userId) await refresh(userId);
  };

  return (
    <View style={{ gap: spacing.md }}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label={t('onboarding.orgName')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            autoCapitalize="words"
          />
        )}
      />
      {formError ? (
        <Text variant="small" color="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}
      <Button
        label={t('onboarding.create')}
        loading={isSubmitting}
        onPress={() => {
          void handleSubmit(onSubmit)();
        }}
      />
    </View>
  );
}
