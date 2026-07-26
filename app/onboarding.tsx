import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { CreateOrgForm } from '@/features/organizations';
import { Screen, Text, spacing } from '@/ui';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="display">{t('onboarding.title')}</Text>
          <Text variant="body" color="slate">
            {t('onboarding.subtitle')}
          </Text>
        </View>
        <CreateOrgForm />
      </View>
    </Screen>
  );
}
