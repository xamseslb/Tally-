import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { EditProjectForm, useProject } from '@/features/projects';
import { ReportCard, listProjectReports, type ReportRow } from '@/features/reports';
import { logger } from '@/lib/logger';
import { Button, Card, Text, Screen, colors, spacing } from '@/ui';

export default function ProjectDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { project, refetch } = useProject(id);
  const [reports, setReports] = useState<ReportRow[]>([]);

  const refetchReports = useCallback(async () => {
    const result = await listProjectReports(id);
    if (result.ok) setReports(result.value);
    else logger.error('Henting av prosjektrapporter feilet', { error: result.error });
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
      void refetchReports();
    }, [refetch, refetchReports]),
  );

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Back" hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text variant="title" style={{ flexShrink: 1 }}>
          {project?.name ?? t('projects.editTitle')}
        </Text>
      </View>

      <Text variant="heading">{t('projects.reports')}</Text>
      {reports.length === 0 ? (
        <Card>
          <Text variant="small" color="slate">
            {t('overview.empty')}
          </Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} onPress={() => router.push(`/report/${r.id}`)} />
          ))}
        </View>
      )}
      <Button
        label={`+  ${t('overview.newReport')}`}
        onPress={() => router.push(`/report/new?projectId=${id}`)}
      />

      {project ? (
        <>
          <Text variant="heading" style={{ marginTop: spacing.lg }}>
            {t('projects.editTitle')}
          </Text>
          <EditProjectForm project={project} onSaved={() => void refetch()} />
        </>
      ) : null}
    </Screen>
  );
}
