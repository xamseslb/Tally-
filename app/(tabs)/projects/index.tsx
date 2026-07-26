import { useTranslation } from 'react-i18next';

import { Screen, Text } from '@/ui';

/** Prosjektliste — plassholder i Fase 0. Bygges i Fase 2 (spec §3 FR-2). */
export default function ProjectsScreen() {
  const { t } = useTranslation();
  return (
    <Screen syncState="synced">
      <Text variant="title">{t('tabs.projects')}</Text>
      <Text variant="body" color="slate">
        {t('empty.projects')}
      </Text>
    </Screen>
  );
}
