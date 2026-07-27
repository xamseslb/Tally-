import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button, Card, Header, Screen, Text, colors, spacing } from '@/ui';

/**
 * Oversikt (hjem) — «Mine rapporter». Ekte rapportdata kobles på når
 * rapport-flyten bygges (Fase 3). Nå vises tom-tilstand + «Ny rapport».
 */
export default function OversiktScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen scroll>
      <Header
        title={t('tabs.oversikt')}
        right={
          <Pressable accessibilityLabel="Varsler" hitSlop={8}>
            <Ionicons name="notifications-outline" size={24} color={colors.ink} />
          </Pressable>
        }
      />

      <Text variant="heading">{t('overview.myReports')}</Text>

      <Card>
        <View style={{ alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm }}>
          <Ionicons name="document-text-outline" size={40} color={colors.slate} />
          <Text variant="body" color="slate" style={{ textAlign: 'center' }}>
            {t('overview.empty')}
          </Text>
        </View>
      </Card>

      <Button label={`+  ${t('overview.newReport')}`} onPress={() => router.push('/report/new')} />
    </Screen>
  );
}
