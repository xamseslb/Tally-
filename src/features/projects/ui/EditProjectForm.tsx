import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Field, Text, colors, radius, spacing } from '@/ui';

import { type Project, setProjectStatus, updateProject } from '../api/projects-api';
import {
  createProjectSchema,
  type CreateProjectInput,
  PROJECT_STATUSES,
  type ProjectStatus,
} from '../model/schemas';

export function EditProjectForm({ project, onSaved }: { project: Project; onSaved: () => void }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project.name,
      projectNumber: project.project_number ?? '',
      address: project.address ?? '',
      clientName: project.client_name ?? '',
    },
  });
  const [status, setStatus] = useState<ProjectStatus>(project.status as ProjectStatus);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (input: CreateProjectInput): Promise<void> => {
    setFormError(null);
    const saved = await updateProject(project.id, input);
    if (!saved.ok) return setFormError(saved.error);
    const statusRes = await setProjectStatus(project.id, status);
    if (!statusRes.ok) return setFormError(statusRes.error);
    onSaved();
  };

  const field = (
    name: keyof CreateProjectInput,
    label: string,
    cap: 'words' | 'none' = 'words',
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
          autoCapitalize={cap}
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

      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="slate">
          {t('projects.statusLabel')}
        </Text>
        <View style={styles.chips}>
          {PROJECT_STATUSES.map((s) => {
            const sel = s === status;
            return (
              <Pressable
                key={s}
                accessibilityRole="radio"
                accessibilityState={{ selected: sel }}
                onPress={() => setStatus(s)}
                style={[styles.chip, sel && styles.chipSel]}
              >
                <Text variant="label" style={{ color: sel ? colors.onBrand : colors.ink }}>
                  {t(`projectStatus.${s}`)}
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
        label={t('projects.save')}
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
