import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, Field, Text, spacing } from '@/ui';

import { createProject } from '../api/projects-api';
import { createProjectSchema, type CreateProjectInput } from '../model/schemas';

export function CreateProjectForm({ onCreated }: { onCreated: () => void }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', projectNumber: '', address: '', clientName: '' },
  });
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (input: CreateProjectInput): Promise<void> => {
    setFormError(null);
    const result = await createProject(input);
    if (result.ok) onCreated();
    else setFormError(result.error);
  };

  const field = (
    name: keyof CreateProjectInput,
    label: string,
    autoCap: 'words' | 'none' = 'words',
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Field
          label={label}
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors[name]?.message}
          autoCapitalize={autoCap}
        />
      )}
    />
  );

  return (
    <View style={{ gap: spacing.lg }}>
      {field('name', t('projects.name'))}
      {field('projectNumber', t('projects.number'), 'none')}
      {field('address', t('projects.address'))}
      {field('clientName', t('projects.client'))}
      {formError ? (
        <Text variant="small" color="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}
      <Button
        label={t('projects.create')}
        loading={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
      />
    </View>
  );
}
