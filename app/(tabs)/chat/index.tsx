import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card, Header, Screen, Text, colors, spacing } from '@/ui';

/** Chat — plassholder. Realtime-meldinger bygges i Fase 8 (spec §3 FR-6). */
export default function ChatScreen() {
  const { t } = useTranslation();
  return (
    <Screen scroll>
      <Header title={t('tabs.chat')} />
      <Card>
        <View style={{ alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm }}>
          <Ionicons name="chatbubbles-outline" size={40} color={colors.slate} />
          <Text variant="body" color="slate">
            {t('chat.empty')}
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
