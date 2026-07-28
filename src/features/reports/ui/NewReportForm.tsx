import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useProjects } from '@/features/projects';
import { Button, Card, Text, colors, radius, spacing } from '@/ui';

import { createDraftReport } from '../api/reports-api';

/**
 * «Ny rapport» = velg prosjekt, så åpnes dagens rapport (hent-eller-opprett).
 * Selve utfyllingen skjer på rapport-skjermen — derfor bare prosjektvalg her.
 */
export function NewReportForm({
  onCreated,
  defaultProjectId,
}: {
  onCreated: (reportId: string) => void;
  defaultProjectId?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { projects, refetch } = useProjects();
  const [selected, setSelected] = useState(defaultProjectId ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const onCreate = async (): Promise<void> => {
    if (!selected) {
      setError(t('report.selectProject'));
      return;
    }
    setError(null);
    setBusy(true);
    const result = await createDraftReport({ projectId: selected });
    setBusy(false);
    if (result.ok) onCreated(result.value);
    else setError(result.error);
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
                onPress={() => setSelected(p.id)}
                style={[styles.chip, isSel && styles.chipSelected]}
              >
                <Text variant="label" style={{ color: isSel ? colors.onBrand : colors.ink }}>
                  {p.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {error ? (
          <Text variant="small" color="alert" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}
      </View>
      <Button label={t('report.createReport')} loading={busy} onPress={() => void onCreate()} />
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
});
