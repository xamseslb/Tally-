import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Badge, type BadgeTone, Card, Text } from '@/ui';

import type { Project } from '../api/projects-api';

const STATUS_TONE: Record<string, BadgeTone> = {
  active: 'success',
  paused: 'warning',
  completed: 'neutral',
  archived: 'neutral',
};

export function ProjectCard({ project, onPress }: { project: Project; onPress?: () => void }) {
  const { t } = useTranslation();
  const tone = STATUS_TONE[project.status] ?? 'neutral';
  return (
    <Card onPress={onPress} accessibilityLabel={project.name}>
      <View style={styles.row}>
        <Text variant="heading" style={styles.name}>
          {project.name}
        </Text>
        <Badge tone={tone} label={t(`projectStatus.${project.status}`)} />
      </View>
      {project.address ? (
        <Text variant="small" color="slate">
          {project.address}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flexShrink: 1 },
});
