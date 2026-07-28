import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card, Text, spacing } from '@/ui';

import type { ReportDetail } from '../api/reports-api';

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View style={{ gap: 2 }}>
      <Text variant="label" color="slate">
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

/** Lese-visning av rapportfeltene (levert/signert eller ikke-forfatter). */
export function ReportFieldsView({ report }: { report: ReportDetail }) {
  const { t } = useTranslation();
  const empty =
    !report.work_performed &&
    !report.delays &&
    !report.hse_notes &&
    !report.quality_notes &&
    !report.supervisor_comment &&
    !report.notes;

  return (
    <Card>
      <View style={{ gap: spacing.md }}>
        {empty ? (
          <Text variant="body" color="slate">
            {t('report.noWork')}
          </Text>
        ) : null}
        <Row label={t('report.workPerformed')} value={report.work_performed} />
        <Row label={t('report.delays')} value={report.delays} />
        <Row label={t('report.safety')} value={report.hse_notes} />
        <Row label={t('report.quality')} value={report.quality_notes} />
        <Row label={t('report.supervisorComment')} value={report.supervisor_comment} />
        <Row label={t('report.notes')} value={report.notes} />
      </View>
    </Card>
  );
}
