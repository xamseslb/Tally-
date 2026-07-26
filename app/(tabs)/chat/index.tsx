import { useTranslation } from 'react-i18next';

import { Screen, Text } from '@/ui';

/** Chat — plassholder i Fase 0. Bygges sist, i Fase 8 (spec §3 FR-6). */
export default function ChatScreen() {
  const { t } = useTranslation();
  return (
    <Screen syncState="synced">
      <Text variant="title">{t('tabs.chat')}</Text>
    </Screen>
  );
}
