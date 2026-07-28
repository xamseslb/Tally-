import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useProjects } from '@/features/projects';
import { Button, Card, Field, Text, colors, radius, spacing } from '@/ui';

import { createDraftReport } from '../api/reports-api';
import { createReportSchema, type CreateReportInput } from '../model/schemas';

export function NewReportForm({
  onCreated,
  defaultProjectId,
}: {
  onCreated: () => void;
  defaultProjectId?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { projects, refetch } = useProjects();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateReportInput>({
    resolver: zodResolver(createReportSchema),
    defaultValues: { projectId: defaultProjectId ?? '', workPerformed: '' },
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [selected, setSelected] = useState(defaultProjectId ?? '');

  const selectProject = (id: string) => {
    setSelected(id);
    setValue('projectId', id, { shouldValidate: true });
  };

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const onSubmit = async (input: CreateReportInput): Promise<void> => {
    setFormError(null);
    const result = await createDraftReport(input);
    if (result.ok) onCreated();
    else setFormError(result.error);
  };

  if (projects.length === 0) {
    return (
      <Card>
        <Text variant="heading">{t('report.needProject')}</Text>
        <Text variant="body" color="slate">
          {t('report.needProjectBody')}
        </Text>
        <Button
          label={t('projects.newProject')}
          variant="secondary"
          onPress={() => router.replace('/project/new')}
        />
      </Card>
    );
  }

  return (
    <View style={{ gap: spacing.xl }}>
      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="slate">
          {t('report.project')}
        </Text>
        <View style={styles.chips}>
          {projects.map((p) => {
            const isSel = p.id === selected;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSel }}
                onPress={() => selectProject(p.id)}
                style={[styles.chip, isSel && styles.chipSelected]}
              >
                <Text variant="label" style={{ color: isSel ? colors.onBrand : colors.ink }}>
                  {p.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.projectId ? (
          <Text variant="small" color="alert">
            {errors.projectId.message}
          </Text>
        ) : null}
      </View>

      <Controller
        control={control}
        name="workPerformed"
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label={t('report.workPerformed')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.workPerformed?.message}
            multiline
            numberOfLines={4}
            style={styles.multiline}
          />
        )}
      />

      {formError ? (
        <Text variant="small" color="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}

      <Button
        label={t('report.saveDraft')}
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
  chipSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  multiline: { minHeight: 110, paddingTop: spacing.md, textAlignVertical: 'top' },
});
