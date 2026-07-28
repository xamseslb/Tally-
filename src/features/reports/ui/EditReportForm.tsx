import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button, Field, Text, spacing } from '@/ui';

import { type ReportDetail, updateReport } from '../api/reports-api';
import { editReportSchema, type EditReportInput } from '../model/schemas';

/** Redigering av et rapport-utkast — kundens predefinerte felt. */
export function EditReportForm({ report, onSaved }: { report: ReportDetail; onSaved: () => void }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditReportInput>({
    resolver: zodResolver(editReportSchema),
    defaultValues: {
      workPerformed: report.work_performed ?? '',
      delays: report.delays ?? '',
      hseNotes: report.hse_notes ?? '',
      qualityNotes: report.quality_notes ?? '',
      supervisorComment: report.supervisor_comment ?? '',
      notes: report.notes ?? '',
    },
  });
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (input: EditReportInput): Promise<void> => {
    setFormError(null);
    const result = await updateReport(report.id, input);
    if (result.ok) onSaved();
    else setFormError(result.error);
  };

  const area = (name: keyof EditReportInput, label: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Field
          label={label}
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          multiline
          numberOfLines={3}
          style={styles.area}
        />
      )}
    />
  );

  return (
    <View style={{ gap: spacing.lg }}>
      {area('workPerformed', t('report.workPerformed'))}
      {area('delays', t('report.delays'))}
      {area('hseNotes', t('report.safety'))}
      {area('qualityNotes', t('report.quality'))}
      {area('supervisorComment', t('report.supervisorComment'))}
      {area('notes', t('report.notes'))}
      {formError ? (
        <Text variant="small" color="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}
      <Button
        label={t('report.save')}
        loading={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  area: { minHeight: 80, paddingTop: spacing.md, textAlignVertical: 'top' },
});
