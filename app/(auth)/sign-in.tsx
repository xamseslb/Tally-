import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { SignInForm } from '@/features/auth';
import { Screen, Text, spacing } from '@/ui';

export default function SignInScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="display">{t('app.name')}</Text>
          <Text variant="body" color="slate">
            {t('auth.tagline')}
          </Text>
        </View>
        <SignInForm />
      </View>
    </Screen>
  );
}
