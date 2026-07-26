import { useTranslation } from 'react-i18next';

import { Screen, Text } from '@/ui';

/**
 * Rapportliste — plassholder i Fase 0. Virtualisert liste, filtre og
 * tilstandsmaskin bygges i Fase 3 (spec §3 FR-3).
 */
export default function ReportsScreen() {
  const { t } = useTranslation();
  return (
    <Screen syncState="synced">
      <Text variant="title">{t('tabs.reports')}</Text>
      <Text variant="body" color="slate">
        {t('empty.reports')}
      </Text>
    </Screen>
  );
}
