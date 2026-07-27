import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { formatReportDate } from '@/lib/format';
import { Badge, type BadgeTone, Card, Text } from '@/ui';

import type { ReportRow } from '../api/reports-api';

const TONE: Record<string, BadgeTone> = {
  draft: 'warning',
  rejected: 'warning',
  submitted: 'info',
  signed: 'success',
};

export function ReportCard({ report, onPress }: { report: ReportRow; onPress?: () => void }) {
  const { t } = useTranslation();
  return (
    <Card onPress={onPress} accessibilityLabel={report.projects?.name ?? 'Rapport'}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text variant="heading">{report.projects?.name ?? '—'}</Text>
          <Text variant="mono" color="slate">
            {formatReportDate(report.report_date)}
          </Text>
        </View>
        <Badge tone={TONE[report.status] ?? 'neutral'} label={t(`reportStatus.${report.status}`)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  info: { flexShrink: 1, gap: 2 },
});
