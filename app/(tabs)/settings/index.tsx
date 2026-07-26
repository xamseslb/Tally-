import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

import { deleteAccount, signOut, useAuth } from '@/features/auth';
import { Button, Screen, Text, spacing } from '@/ui';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { session } = useAuth();

  const confirmDelete = async (): Promise<void> => {
    const result = await deleteAccount();
    if (result.ok) await signOut();
    else Alert.alert(t('settings.deleteFailed'), result.error);
  };

  const onDeletePress = (): void => {
    Alert.alert(t('settings.deleteConfirmTitle'), t('settings.deleteConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.deleteAccount'),
        style: 'destructive',
        onPress: () => void confirmDelete(),
      },
    ]);
  };

  return (
    <Screen>
      <Text variant="title">{t('settings.title')}</Text>

      <View style={{ gap: spacing.xs }}>
        <Text variant="label" color="slate">
          {t('auth.email')}
        </Text>
        <Text variant="mono">{session?.user.email ?? '—'}</Text>
      </View>

      <View style={{ flex: 1 }} />

      <Button label={t('auth.signOut')} variant="secondary" onPress={() => void signOut()} />
      <Button label={t('settings.deleteAccount')} variant="danger" onPress={onDeletePress} />
    </Screen>
  );
}
