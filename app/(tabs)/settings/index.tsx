import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

import { deleteAccount, signOut, useAuth } from '@/features/auth';
import { useMembershipStore } from '@/features/organizations';
import { exportReportsToExcel } from '@/features/reports';
import { notify } from '@/lib/confirm';
import { Button, Card, Header, Screen, Text, spacing } from '@/ui';

/** Profil — konto, teamadministrasjon, utlogging og kontosletting. */
export default function ProfilScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const role = useMembershipStore((s) => s.membership?.role);
  const canManage = role === 'admin' || role === 'manager';

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

      {canManage ? (
        <Button
          label={t('team.manage')}
          variant="secondary"
          onPress={() => router.push('/admin/users')}
        />
      ) : null}

      {canManage ? (
        <Button
          label={t('settings.exportExcel')}
          variant="secondary"
          onPress={() => {
            void exportReportsToExcel().then((r) => {
              if (!r.ok) notify(r.error);
            });
          }}
        />
      ) : null}

      <View style={{ gap: spacing.md }}>
        <Button label={t('auth.signOut')} variant="secondary" onPress={() => void signOut()} />
        <Button label={t('settings.deleteAccount')} variant="danger" onPress={onDeletePress} />
      </View>
    </Screen>
  );
}
