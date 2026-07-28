import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAuth } from '@/features/auth';
import {
  EditReportForm,
  ReportAttachments,
  ReportFieldsView,
  ReportLineItems,
  type ReportDetail,
  rejectReport,
  signReport,
  submitReport,
  useReport,
} from '@/features/reports';
import { confirm, notify } from '@/lib/confirm';
import { formatReportDate } from '@/lib/format';
import { Badge, type BadgeTone, Button, Card, Screen, Text, colors, spacing } from '@/ui';

const TONE: Record<string, BadgeTone> = {
  draft: 'warning',
  rejected: 'warning',
  submitted: 'info',
  signed: 'success',
};

export default function ReportDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { report, refetch } = useReport(id);
  const { userId, session } = useAuth();
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const run = async (action: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusy(true);
    const result = await action();
    setBusy(false);
    if (!result.ok) notify(result.error ?? 'Failed');
    else await refetch();
  };

  const onSubmit = () =>
    confirm({
      title: t('report.submit'),
      confirmLabel: t('report.submit'),
      cancelLabel: t('common.cancel'),
      onConfirm: () => void run(() => submitReport(id)),
    });

  const onSign = () =>
    confirm({
      title: t('report.signTitle'),
      message: t('report.signBody'),
      confirmLabel: t('report.sign'),
      cancelLabel: t('common.cancel'),
      onConfirm: () => void run(() => signReport(id, 'performer', session?.user.email ?? 'signed')),
    });

  const onReject = () =>
    confirm({
      title: t('report.rejectTitle'),
      message: t('report.rejectPrompt'),
      confirmLabel: t('report.reject'),
      cancelLabel: t('common.cancel'),
      destructive: true,
      onConfirm: () => void run(() => rejectReport(id, '')),
    });

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Back" hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text variant="title">{t('report.title')}</Text>
      </View>

      {report ? (
        <Content
          report={report}
          isAuthor={report.author_id === userId}
          busy={busy}
          onSubmit={onSubmit}
          onSign={onSign}
          onReject={onReject}
          onSaved={() => void refetch()}
        />
      ) : null}
    </Screen>
  );
}

function Content({
  report,
  isAuthor,
  busy,
  onSubmit,
  onSign,
  onReject,
  onSaved,
}: {
  report: ReportDetail;
  isAuthor: boolean;
  busy: boolean;
  onSubmit: () => void;
  onSign: () => void;
  onReject: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const editable = report.status === 'draft' && isAuthor;
  return (
    <>
      <Card>
        <View style={styles.headerRow}>
          <Text variant="heading" style={{ flexShrink: 1 }}>
            {report.projects?.name ?? '—'}
          </Text>
          <Badge
            tone={TONE[report.status] ?? 'neutral'}
            label={t(`reportStatus.${report.status}`)}
          />
        </View>
        <Text variant="mono" color="slate">
          {formatReportDate(report.report_date)}
        </Text>
      </Card>

      {editable ? (
        <EditReportForm report={report} onSaved={onSaved} />
      ) : (
        <ReportFieldsView report={report} />
      )}

      <ReportLineItems report={report} editable={editable} onChanged={onSaved} />

      <ReportAttachments report={report} editable={editable} onChanged={onSaved} />

      {report.review_note ? (
        <Card>
          <Text variant="label" color="alert">
            {t('report.returnedNote')}
          </Text>
          <Text variant="body">{report.review_note}</Text>
        </Card>
      ) : null}

      {report.status === 'signed' ? (
        <Card>
          <View style={styles.lockRow}>
            <Ionicons name="lock-closed" size={18} color={colors.success} />
            <Text variant="label" color="success">
              {t('report.locked')}
            </Text>
          </View>
          {report.signatures.map((s) => (
            <View key={s.signer_role} style={{ gap: 2 }}>
              <Text variant="body">
                {t('report.signedBy')}: {s.signer_role}
              </Text>
              <Text variant="mono" color="slate">
                {s.signed_at.replace('T', ' ').slice(0, 16)}
              </Text>
            </View>
          ))}
          {report.content_hash ? (
            <Text variant="small" color="slate">
              {t('report.documentHash')}: {report.content_hash.slice(0, 16)}…
            </Text>
          ) : null}
        </Card>
      ) : null}

      {report.status === 'draft' && isAuthor ? (
        <Button label={t('report.submit')} loading={busy} onPress={onSubmit} />
      ) : null}
      {report.status === 'submitted' ? (
        <View style={{ gap: spacing.md }}>
          <Button label={t('report.sign')} loading={busy} onPress={onSign} />
          <Button label={t('report.reject')} variant="danger" onPress={onReject} />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
