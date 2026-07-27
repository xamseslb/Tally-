import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

import { deleteAccount, signOut, useAuth } from '@/features/auth';
import { Button, Card, Header, Screen, Text, spacing } from '@/ui';

/** Profil — konto, utlogging og kontosletting (Apple 5.1.1(v)). */
export default function ProfilScreen() {
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
    <Screen scroll>
      <Header title={t('tabs.profil')} />

      <Card>
        <Text variant="label" color="slate">
          {t('auth.email')}
        </Text>
        <Text variant="heading">{session?.user.email ?? '—'}</Text>
      </Card>

      <View style={{ gap: spacing.md }}>
        <Button label={t('auth.signOut')} variant="secondary" onPress={() => void signOut()} />
        <Button label={t('settings.deleteAccount')} variant="danger" onPress={onDeletePress} />
      </View>
    </Screen>
  );
}
